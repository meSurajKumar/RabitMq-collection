# RabbitMQ Topic Exchange Pattern Matching

In RabbitMQ's topic exchange, routing keys are dot-separated words.
Use `*` to match **exactly one word**  
Use `#` to match **zero or more words**

---

## 🧩 Matching Table

| Pattern               | Matches?                | Reason                                                |
|------------------------|-------------------------|--------------------------------------------------------|
| `mail.#`              | ✅ `mail.user.signup`    | `#` matches all after `mail`                          |
| `mail.*`              | ✅ `mail.user`           | `*` matches one word                                  |
| `mail.*.signup`       | ✅ `mail.user.signup`    | `*` = `user`, then `signup` matches                   |
| `mail.#.signup.user`  | ✅ `mail.service.signup.user` | `#` = `service`, rest matches                        |
| `mail.#.signup.user`  | ✅ `mail.signup.user`    | `#` matches zero words                                |
| `mail.#.signup.user`  | ❌ `mail.signup.admin.user` | `user` not immediately after `signup`              |
| `*.notification.#`    | ✅ `email.notification.sent` | `*` = `email`, `#` = `sent`                        |
| `*.notification.#`    | ❌ `email.sms.notification` | `sms` isn't in correct position                      |
| `mail.*.*`            | ✅ `mail.x.y`            | both `*` match `x` and `y`                            |
| `mail.*.*`            | ❌ `mail.x.y.z`          | three words after `mail`, pattern allows only two     |

---

## 🔁 Wildcard Summary

- `*` → matches **exactly one** word  
  Example: `mail.*` matches `mail.user`, not `mail.user.signup`

- `#` → matches **zero or more** words  
  Example: `mail.#` matches `mail`, `mail.user`, `mail.x.y.z`

---

## 🎯 Tips

- Routing key: `mail.user.signup.success`
- Pattern: `mail.*.*.*` ✅ matches
- Pattern: `mail.#` ✅ matches
- Pattern: `*.signup.#` ❌ doesn't match (doesn't start with `mail`)

