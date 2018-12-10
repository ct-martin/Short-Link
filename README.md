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

## MVC/React/Templating

Handlebars abstracts the base dependencies from the page itself.
Handlebars specifies which React bundle to load, and then React takes over rendering.
All views (inc. dynamic) are generated from React and all data is taken from API requests that return JSON arrays.

## Mongo Storage

Mongo stores accounts, shortened links, & link stats

## Above & Beyond (post-Project 2)

* Deployed on Dokku
* Charts

## Difference-ness from Project 2

* Support for Dokku hosting
* Validation of slugs & redirect links
  * Slugs are lowercased for cleanliness
* Fixed password changing validation
* User Agent tracking
* Many UI improvements
* Env variable for enabling registration
* CSV Export
* Charts

## 8 Views

1. Login
2. Signup
3. Password change
4. Shorten URL
5. View URLs
6. URL Statistics Summary/Charts
7. URL Statistics Table
8. URL Statistics CSV

## Feature ideas

* Redirect based on user agent (e.g. Android/iOS to respective store, by country, etc.)
* Referrer analytics
* Clicks in general vs. unique users (using session)
* Custom subdomains (instead of being subdomain-agnostic)
* Implementation of user tiers (admin, paid, free)
  * Paid tier features, such as scheduling of links & no duration limit
* Email/OAuth registration & verification
* Domain & string blacklists
