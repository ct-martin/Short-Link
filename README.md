# Short Link Documentation

## Purpose

URL Link Shortener, similar to bit.ly, s-r.io, etc.

It supports tracking of clicks, including referrer & geolocation (see note in "Above & Beyond" section).

## Profit

User tracking is very popular in business web usage right now.
Paid tiers that give increasing information would be a quick profit model to implement.

* Link permanence
  * Custom domains
  * Limited vs. permanent duration of links
  * Ability to schedule links for a given timeframe
* User tracking; level of information available to the user
  * Detail of stats
    * How far back stats go (1 week, 1 month, 3 months, etc.)
    * Free tier might only get summaries
  * Which stats are available (only clicks? country, referrer, etc.)

## Templating

I used Handlebars layout to abstract the base dependencies from the page itself.
Handlebars specifies which React bundle to load, and then React takes over rendering.

## MVC

All views (inc. dynamic) are generated from React and all data is taken from API requests that return JSON arrays.

## Mongo Storage

Mongo stores accounts, shortened links, & link stats

## Above & Beyond

* React used
* Tracking of each link click (referrer, country of origin, & timestamp)
* If behind Cloudflare w/ IP Geolocation on it will track country codes
  * Currently have hooked up to my site loosely via Cloudflare MitM

## Difference-ness from DomoMaker

The code is based on DomoMaker-E, but most of it was gutted.
For example, the front-end is almost entirely re-written.

My estimate for how close to DomoMaker this is:
* Approx. 1/3 DomoMaker (app.js, most of Account backend)
* Approx. 1/3 heavily-refactored DomoMaker (similar, but different; such as the Link model)
* Approx. 1/3 completely or near-completely original (such as the handlebars templates, React code, & link tracking)

These numbers are ballparks, use your own judgement

## 6 Views

1. Login
2. Signup
3. Password change
4. Shorten URL
5. View URLs
6. URL Statistics

## Feature ideas

* Tracking & analysis of user agent header
  * Redirect based on platform
* Sanitization of URL slugs & redirect URLs
* Clicks in general vs. unique users (using session)
* Charts of stats
* Custom subdomains (instead of being subdomain-agnostic)
* Implementation of user tiers (admin, paid, free)
  * Paid tier features, such as scheduling of links & no duration limit
* Deploy on my site (I wrote this because I actually want to use this)
  * Registration toggle (via environment variable?)
* Domain & string blacklists
