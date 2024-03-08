---
title: "The hypothetical wordy textbook"
date: 2023-06-06T11:19:53+02:00
draft: false
---

Many textbooks are written in a terse style. When reading these kinds of texts, I find it helpful to ask: "What would the insufferably wordy version of this text look like?" This is all about reading critically. Typically, this involves doing either one of two things:

- Expanding on definitions: Can we rephrase the definition? Why do we care about this concept? Is there a handwavy, more intuitive definition? Consider, for example, the definition of a homeomorphism. We say a map $f : X \to Y$ is a homeomorphism if it is continuous, bijective and open. If we wish to elaborate on this, we might say that a homeomorphism is a map preserving the structures of the topological spaces $X$ and $Y$. Thus, if we can find a homeomorphism between $X$ and $Y$, they are the "roughly the same". Now we have a better idea of what a homeomorphism is.
- Motivating proofs in detail: What is the big picture? Are we heading towards a contradiction? What happens if we drop an assumption? Ideally, one should be able to reverse engineer the solution. To illustrate, let us try motivating the proof that an absolutely convergent series in a Banach space is also convergent. The statement is that if $X$ is a Banach space and $x_i \in X$, then $\sum_{i=1}^{\infty} x_i$ converges whenever $\sum_{i=1}^{\infty} \|x_i\|$ does. This seems simple enough to show directly. Assume then that $\sum_{i=1}^{\infty} \|x_i\|$ converges. Because we have nothing else to work with, we should presumably use that $X$ is complete. Can we write $\sum_{i=1}^{\infty} x_i$ as the limit of a Cauchy sequence? Maybe. We have $$\sum_{i=1}^{\infty} x_i = \lim_{n \to \infty} \sum_{i=1}^{n} x_i = \lim_{n \to \infty} s_n,$$ where $s_n$ is the $n$:th partial sum. Is $(s_n)$ a Cauchy sequence? Supposing that $n > m,$ we obtain $$\|s_n - s_m\| = \|\sum_{i=m+1}^{n} x_i\| \le \sum_{i=m+1}^{n}\|x_i\|.$$
This tends to $0$ as $n, m \to \infty$, because of our assumtion on $\sum_{i=1}^{\infty} \|x_i\|$. We conclude that $(s_n)$ is Cauchy, and it converges because $X$ is complete. Notice how we made an effort to understand each step. This becomes ever more important in more involved proofs.

The main point is, of course, to engage with the material. But whereas "Read proactively" is a very general piece of advice, it might be easier visualising the would-be 1000-page version of the text.
