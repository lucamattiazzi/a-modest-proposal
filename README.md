# A modest proposal

A modest proposal on how to enhance the capability of a laboratory to run samples on people. Allows to run a simulation changing the variables, and also to see a precomputed heatmap of results for a range of inputs.

## Theory

### Prior assumptions

It's based on the knowledge that:

- PCR has high sensitivity, so diluting a sample will not change the outcome of a test.
- Samples positive for SARS-CoV-2 are rare among the whole samples, around 10% in Italy as of today, even less in other countries.
- The main problem with samples currently is the low throughput, we can only test so many people.
- It's easy to get samples from people.

### The proposal

With this knowledge, the proposal is to mix the samples of several people into one, and run tests on the mixed sample. Knowing how the test works, we know that if there is a single positive person in the mixed sample, the test will result positive, negative otherwise.

Creating several different and random combinations of people, we can reduce (compress) the number of tests getting enough useful information, leveraging the 3 facts listed before.

The process of creating combinations should have a few rules:

- There should be a maximum number of people in each mix.
- Two people should never be part of more than one mix, in order to keep as many information as possible.
- The number of mixed samples should, of course, be less than the number of people.

When the combinations has been created, we run the tests: we can consider positive each person that appears only in positive tests. It might happen that someone appears only in positive tests without being positive themselves, but it's rare given the situation.
This method would work in an ideal situation where the number of false negatives is 0, but this is not the case, so we use a different validation: if the ratio of positives tests are higher than a threshold, the person is considered positive.

### Why

This method has the following advantages:

- The number of people we can analyze with a fixed amount of tests grows, first analysis suggests that a growth of 20/25% of tests is safe from major drawbacks.
- The test will become more solid against false negatives: when a person is tested several times, the chance of all of them being false negatives is lower, and the correct threshold can identify these people as positives even if the resulted negative in some of their tests.

There is a drawback too, because some of the information is lost of course: the number of false positives will grow. This is a minor stepback for a couple reasons:

- The growth of false positives is strongly dependant on the ratio of actual positives, that is, currently, really low. While is < 20%, it can be safe to use this method.
- False positives are less problematic than false negatives, the result might simply be that those that result as false positives will be quarantined without the need to be.

## This website

This website is both an explanation of the method a possibility to run a simulation of what could happen.

The first part allows to run a simulation of the application of this method on a randomly generated population, using several variables as input.

### Simulation Inputs

#### Diffusion of COVID among tested

Ratio of people actually infected with SARS-CoV-2 in the population to be tested. Can range from 0% to 100%. Actual value is currently ~10% in Italy as of today.

#### Number of people to be tested

Size of the population to be tested. Can range from 100 to 5000, since the simulation would be too slow if it went higher (could be optimized, but who cares).

#### Number of pools to create

Size of the pools that will actually be tested. For obvious reasons, it cannot be higher than number of people to be tested.

#### Number of people in each pool

When creating a pool, it's possible to set the number of people that will mix their sample to create that pool. It ranges from 2 to 12. Higher values might be useful, but at the moment I'd limit it to this nice 12.

#### Prior false positive ratio

The ratio of false positives that the test returns. A false positive is a test that results positive even if the sample has no presence of infection. It's not up to choice for the user, but an intrinsic feature of the test itself.

#### Prior false negative ratio

The ratio of false positives that the test returns. A false negative is a test that results negative even if the sample has presence of infection. Obviously, it's fare more dangerous, in this case, a false negative than a false positive. It's not up to choice for the user, but an intrinsic feature of the test itself.

#### Positive ratio for considering a person positive

This is the only variable that actually requires an explanation: using a perfect test, one can assume that a person is positive if all of the pools that have their sample in the mix are positive. This assumption should nonetheless be discarded since most test have false negatives. In order to protect the final result from the disruptive result of false negatives, we can use this threshold. Instead of considering positive a person if all of its pools are positive, we consider them positive if the positive tests ratio (positive/all) is higher or equal to threshold.

### The heatmap

The heatmap is generated running some simulations for some values, but has become a little bit outdated since I've added more variables. Still, it looks good, so I've decided to keep it for the moment. Also, a dataviz makes everything look cooler.

## Does it make sense?

It does to me! If you spot a mistake (not at all improbable), think that all of this is total bullshit, have any question or want to tell me anything, please contact me via github (top left corner) or at l.d.mattiazzi@gmail.com
