### Robustness

Robustness is both an objective and a subjective property.
Software should _be_ robust, of course: unexpected input should be handled gracefully, operations should be idempotent where possible, and so on.
But it should also _feel_ robust.

You want your software to feel like it isn’t going to fall apart.
You want it to feel immediate and responsive, as if it were a big mechanical machine, not a flimsy plastic “soft switch.”

Subjective robustness requires attention to detail and thinking hard about what can go wrong.
It’s lots of little things: keeping the user informed about what’s happening, explaining what common errors mean, not printing scary-looking stack traces.

As a general rule, robustness can also come from keeping it simple.
Lots of special cases and complex code tend to make a program fragile.
