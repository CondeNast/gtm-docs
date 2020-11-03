# Tagging 3rd party ecommerce & membership clubs

## Context

Condé Nast runs various pieces of technology - Google Analytics (GA), Treasure Data (TD), Permutive, and
others on its websites around the globe to track users. These tags are generally injected via Google Tag
Manager (GTM) due to its ease of use, relative sophistication and compatibility with various tools.
This document discusses our approach and stratgy to GTM on websites Condé Nast owns and controlls vs
websites operated for Condé Nast by third party vendors.

Condé Nast tags its editorial and other owned-and-operated websites up with GTM, and now intends to to tag
third party ecommerce websites and membership clubs as well. The goal is to ensure continuity of data
collection and insight on users as they move across properties, no matter if Condé Nast owns them or not.
This would empower, for example, being able to segment users who have added-to-basket but not completed
a transaction on a subscription website operated by a fulfilment partner.

Examples of third party websites operated on Condé Nast's behalf include:

- [www.magazineboutique.co.uk](https://www.magazineboutique.co.uk) - Operated by CDS UK for the British market
- [editorsclub.gq-magazine.co.uk](https://editorsclub.gq-magazine.co.uk) - Operated by Pugpig for the British market
- [f.msgs.jp](https://f.msgs.jp/webapp/form/16237_nay_596/index.do?code=lp_member) - Vogue member club sign-up operated by msgs.jp (?)

Other similar examples exist in all markets, including the US of A.

A full list (~70 websites) is available in this [google sheet tab](https://docs.google.com/spreadsheets/d/1MK9H4kmnazwfd0qMUHMlosEm5fT7xHm2wuGiIH1vbgk/edit?ts=5f452e60#gid=1665694749)

## GTM for editoral sites

In a globally owned GTM account there is a set of fairly standardised tags, triggers and variables set up for use
across Condé Nast's editorial websites. This makes sense; owned-and-operated editorial websites _mostly_ work
the same way (Compass, Verso, and other mature markets), use the same cookie management platform (CMP) - OneTrust,
achieve the exact same goals, and are easy enough to  apply a broad-strokes approach to tagging. This allows
Condé Nast to quite easily get an identical TD, Permutive, Google Analytics, and so on, setup running across all of the
editorial sites.

It is worth questioning the scalability of this approach, however. Each brand in each market has a
manually configured container, and another alongside for AMP, as well as some other stragglers. At present, this
comprises 40-45 containers (for Vogue and GQ), all managed and maintained individually by hand. This may collapse
somewhat as some brand sites are consolidated by language. For now this topic shall be considered out of scope of
this document.

Scalability aside, the approach makes sense, it is a fairly standardised pattern. No comment is made as to the cleanliness
of the code within tags, naming conventions, and so on, although these should be reviewed in time by engineering.

## GTM for third parties

Compared with editorial sites owned by Condé Nast, third parties present almost the opposite scenario.

Third party websites by nature are all different, and additionally the vendors that operate them may run their own
cookie management platforms. Condé's relationship with vendors is also different in every case: some vendors
can react to change requests quickly, while others want more time and also wish to charge project management
and development fees even for small changes. Obviously, every vendor is a fresh start and so there is little
in the way of scalability.

In some reported cases vendors have refused to run any code that Condé supplies - it is after all their product and
their website, so this is partially understandable at least. Such vendors are clearly out of scope.

It is also worth noting that within third party vendors there is not always working knowledge of GTM, therefore a requirement
to run and interact with GTM can include extra time for the vendor to learn and understand GTM itself. Understanding GTM
is generally not in the vendor's interests: from its point of view, it wants to throw tags in pages as quickly as possible
and move on.

With respect to the differences in first and third party sites, and Condé's desire to run GTM on third party sites,
it appears that an ideal secenario would be:

* Third parties do not have to learn GTM
* Third parties have to do as little as possible to integrate
* As much as possible is owned managed by Condé via GTM, and as little as possible by the third party
* Any CMP can be used
* One container to be used for all third party sites

## Proposed solution

Condé should load scripts - TD, Permutive, etc - through GTM. It should do this through _one_ container for all
third party ecommerce sites by way of shipping a small JS library via GTM, which abstracts away GTM from the third
party's point of view.

The library should also offer to load Condé's CMP if the vendor does not have one of its own, or in the case the 
vendor has its own CMP, should offer an interface for the third party to indicate that consent for tracking has been
granted to its own CMP by the end user. See further details on this below.

The library should offer a few ecommerce related methods for the most common ecommerce activities that Condé considers
core to any ecommerce experience: `add to basket` and `check out` seem the most obvious, alongside the site identifying
itself, presumably via a `register` method and supplying a market country code, brand code, and some other identifier
such as `subscription` or `member club`.

Finally, the only script for a third party to install on their web site should be Condé's GTM container. Alongside,
the vendor should write a few small javascript functions which listen to events and call methods when activities (such as
add to basket) happen on their site. They may also call the aforementioned convenience method to signal that consent
has been granted 

The above appears to satisfy all of the desired goals:

* All scripts loaded via GTM
* The third party developer does not need to learn GTM specifics
* Everything, including GTM implmenenation specifics, are controlled by Condé and facaded by a library interface
* Third party native or Condé CMP support
* With the ability to identify a site by brand, market and ecommerce intent, one container can be used across all ecommerce sites

## POC
