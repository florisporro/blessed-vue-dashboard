# Blessed dashboard for Google Analytics and Nucleus

Gathers statistics from Google Analytics and Nucleus to display usage statistics

## Installation

To install and compile:
`npm install && npm build`

To start:
`npm start`

## Authentication

Create a auth_google.json and a auth_nucleus.json.

The Nucleus file could look like:

```
{
	"appId": "...",
	"token": "..."
}
```

The google file is partially generated by your Google API authentication, but should be augmented with:

```
{
	"viewId": ...
}
```

## Tutorials I used to make this:

 - https://flaviocopes.com/google-analytics-api-nodejs/
 - https://flaviocopes.com/google-api-authentication/