---
title: "The wordy textbook"
date: 2023-06-06T11:19:53+02:00
draft: false
---

Many textbooks are written in a terse style. When reading these kinds of texts, I find it helpful to ask: "What would the insufferably wordy version of this text look like?" This makes you read critically. Broadly speaking, I think there are two ways of adding fluff.

### Expanding on definitions
After doing this, we should understand what a term means and why it matters. Some prompts:
- Can we rephrase the definition?
    - **Example.** Homeomorphisms are continuous bijections with continuous inverses. But a homeomorphism $f : X \to Y$ can also be thought of as a map preserving the underlying structures of the topological spaces $X$ and $Y$. From our point of view, $X$ and $Y$ are roughly the same.
- Why do we care about this concept?
    - **Example** A subgroup $N \subset G$ is normal iff $gNg^{-1} = N$. The reason we care about normal subgroups is that we can form factor groups with them. Otherwise the multiplication of cosets is not well defined. 
- Is there a handwavy, more intuitive definition?
    - **Example.** If $Y$ is a deformation retraction of $X$, we can continuously "squish $X$ onto $Y$".
- What is the etymology of the given word?
    - **Example**. We say $G$ is perfect if, for every induced subgraph of $H$, the chromatic number $\chi(H)$ equals the clique number $\omega(H)$. Any graph satisfies $\chi(H) \ge \omega(H)$. Perfect graphs are perfect in the sense that the lower bound is always attained, for any induced subgraph.

### Motivating proofs
Ideally, we should be able to reverse engineer the solution.
- Can we sketch the proof?
    - **Example.** To prove Liouville's theorem, apply Cauchy's integral formula for derivatives.
- How do the assumptions go into the proof?
    - **Example.** Wilson's theorem states that $(p-1)! \equiv -1 \mod p$ for $p$ prime. The idea is that almost every element in $(p-1)!$ can be paired with its own inverse. If $p$ is not prime, not every element is a unit.
- What do we need to memorise to derive the result?
    - **Example.** To show that the product $fg$ of two primitive polynomials $f$ and $g$ is primitive, apply the projection $\mod p$ for $p$ to the coefficients. This is the crux of the proof, and the rest is routine.
    
The main point is, of course, to engage with the material. There are plenty of other questions to be asked, but these are some I found particularly useful. When doing this, I like thinking of the would-be 1000-page version of the text.
