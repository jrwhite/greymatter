---
theme: 'white'
transition: 'slide'
highlightTheme: 'darkula'
---

# greymatter

An Application for Building Spiking Neural Networks

<small>Created by Jarod White</small>

---

# hello

I'm Jarod

This is a bit of a brain dump

---

This is what it looks like

---

# motivation

Why I built Greymatter

--

First, let's talk about neurons

--

Neurons

Biological <!-- .element: class="fragment fade-up" -->

Artificial <!-- .element: class="fragment fade-up" -->

Can there be something to bridge the gap?

--

### Exploratory AI Design

A self-contained development experience that values **intuition** and **creativity**.

It's self-contained. No looking up API references or linear algebra identities.

Greymatter is something you can play with.

Importantly, not trying to solve ML problems better or more efficiently. Just differently.

<small>
 > "Arc is designed for exploratory programming: the kind where you decide what to write by writing it. A good medium for exploratory programming is one that makes programs brief and malleable, so that's what we've aimed for. This is a medium for sketching software."

-Paul Graham and Robert Morris' motivation for creating Arc Lisp</small>

<!-- It's not a coincidence that we wrote a language for exploratory programming rather than the sort where an army of programmers builds a big bureaucratic piece of software for a big, bureaucratic organization. Exploratory programming is the fun end of programming, and we hope that will be the guiding principle of the Arc community." -->

---

## Technical Stuff

--

### The Stack

Desktop application built with:

Electron and Typescript (React,Redux)

Can run :
Desktop Application
Desktop Client w/ Cloud Runtime Server
Web application

--

### Configurations

Can be accelerated by running a native binary written in nim and clojure
Can be accelerated by running a native runtime either locally or on a cloud server (client-server configuration)

--

Connects to an Environment Server (just OpenAI Gym right now)

---

### Neuron Model

This stuff you probably already know but I'm going to go through it real quick just-in-case. I'm going to assume you already have a bit of an idea of how neurons work.

--

### Parts of a Neuron

Inputs - Dendrites

Body - Soma

Output - Axon

Connection - Synapse

--

### Neuron Potential

Dendrites (inputs) have a weighting

Potential decays over time

There is a threshold at which the neuron will fire

--

### Firing An Action Potential

All-or-nothing signal

Like a sneeze (how do you encode info in a sneeze?)

Afterwards, neuron is hyperpolarized

--

### Example

The Patellar Reflex

--

### Under the Hood

Izhikivich model

--

### Neurotransmitters

Excitatory

Inhibitory

Also, there are volume-effect neurotransmitters (dopamine and seratonin are common ones in your brain)

---

### Learning

Plasticity

Changes in dendritic (input) weightings

In neuroscience, it's often separated into short-term and long-term (~10 ms and ~10 min)

--

Short-term potentiation

--

Short-term depression

--

Spike-Time-Dependent Plasticity

(Hebbian learning)

--

Example: Pavlov's Dog

--

Long-term potentiation

---

Greymatter's philosophy

--

To build inspired AI,
use need principled AI design

--

## Core Values

Principled AI design is inspired AI design

1. Neurons are decentralized. Their operation is defined by local variables.
2. Neurons send one-way, all-or-nothing signals. They translate as much information as a sneeze.
3. Neural networks function as part of a system. There is no such thing as a brain in a vat
4. Learn like how we learn (leopards and yoga pants)

--

### Principles of Neural System Design

#### With Greymatter

To make generalizable networks, you can play with these free parameters. Networks are hand-designed, not hand-tuned. To ensure you don't over fit, Greymatter restricts your design to these aspects:. To ensure you don't over fit, it is important to follow these best practices

1. Anatomy

e.g. photoreceptor for visible light of certain amplitude or crossing the chiasm (also if u havent read it, it sounds very close to 'crossing the chasm' which is a very good book that you should read)

The key here is to define encode observations into a neuron's current. You can choose the observation range and the encoding function (e.g. logarithmic or linear)

we aren't interested in replicating evolution. evolutionary algorithms are cool but it's not a job for neurons alone

2. Topology

e.g. crossing the chiasm

this is where the most iteration takes place. there are some obvious topology choices like when you are processing duplex/complementary inputs but generally it takes a lot of time and debugging to get a feel for how structure precedes function and what kinds of function generalizes well. After I show you an example, I'll get into bifurcation analysis and it will make a little more sense. Or at least seem a little less abstract and hand-wavy.

3. Morphology (for all neurons)

Adjust the operating characteristics of neurons. the key here is to not cherry pick parameters or fine-tune individiaul neurons. generally, set the bulk of the neurons to have the same morphology and only fine-tune neurons that sit at an important choke-point or something. You also dont want to change these very often. It shold be one of the last things you change on you mental list as it takes observing several episodes of the network to notice morphological contributions to network behavior.

Networks are modularizable. They have specific functionality (e.g. a fine motor cortex and a gross motor cortex)

---

## Environments

---

## OpenAI gym

---

## Reinforcement Learning

---

## Example

CartPole-v1

---

## Bifurcation Analysis

compare time-domain to frequency-domain analysis

this is the answer to why it can be cool to start with spiky neurons and then go to rate-encoding later

---

## Putting it All Together

---

## Example

MountainCarContinuous-v0

---

## Roadmap
