# Tagging 3rd party ecommerce & membership clubs

## Context

Condé Nast runs various pieces of technology - Google Analytics (GA), Treasure Data (TD), Permutive, and
others on its websites around the globe to track users. These tags are generally injected via Google Tag
Manager (GTM). This document discusses our approach and stratgy to GTM on websites Condé Nast owns and
controlls vs websites operated for Condé Nast by third party vendors.

Condé Nast tags its editorial and other owned-and-operated websites up with GTM, and now intends to to tag
ecommerce websites and membership clubs as well. The goal is to ensure continuity of data collection and insight
on users as they move across properties, no matter if Condé Nast owns them or not. This would empower,
for example, being able to segment users who have added-to-basket but not completed a transaction on third
party websites.

Such other third party websites websites are generally operated by external partners who sell magazine 
subscriptions, or offer other ecommerce activities such as merchandise stores or private membership clubs.
Examples include:

- [www.magazineboutique.co.uk]0 - Operated by CDS UK for the British market
- [editorsclub.gq-magazine.co.uk](https://editorsclub.gq-magazine.co.uk) - Operated by Pugpig for the British market
- [f.msgs.jp](https://f.msgs.jp/webapp/form/16237_nay_596/index.do?code=lp_member&_ga=2.6397490.1635249738.1599243470-1948917294.1592946764) - operated by (?) in Japan for Vogue Japan print subs

Other similar examples exist in all markets.

A full list (~70 websites) is available in this [google sheet tab](https://docs.google.com/spreadsheets/d/1MK9H4kmnazwfd0qMUHMlosEm5fT7xHm2wuGiIH1vbgk/edit?ts=5f452e60#gid=1665694749)

## GTM for editoral sites

In a global GTM account there is a set of fairly standardised tags, triggers and variables set up for use
across Condé Nast's editorial websites. This makes sense; owned-and-operated editorial websites _mostly_ work
the same way (Compass, Verso, and other mature markets), use the same cookie management platform (OneTrust),
achieve the exact same goals, and are easy enough to  apply a broad-strokes approach to tagging. This allows
Condé Nast to quite easily get an identical TD, Permutive, GA, and so on, setup running across all of the
editorial sites.

It is worth questioning the scalability of the approach, however. Each brand, in each market, has a
manually configured container, and another on top for AMP, alongside some other stragglers. At present, this
comprises 40-45 containers (for Vogue and GQ), all managed and maintained by hand.

Scalability aside, the approach makes sense - a fairly standardised pattern. No comment is made as to the cleanliness
of the code within tags, naming conventions, and so on, although these should be reviewed in time by engineering.

## GTM for third parties

Compared with editorial sites owned by Condé Nast, third parties present almost the opposite scenario. Third party
websites by nature are all different. Furthermore, the companies that operate them may run their own cookie 
management 

Not only are they all completely different (compare [Magazine Boutique](https://www.magazineboutique.co.uk) with
[PresidentStore.jp](https://presidentstore.jp/cart_index.html?request=insert&item_cd=GQ01NRG)
