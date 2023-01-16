---
name: Bug
about: Report a bug found in the SDK
title: ''
labels: bug,needs-triage
assignees: mwwoda, mhagmajer, antusus, arjankowski, lukaszsocha2, bartlomiejleszczynski, congminh1254
---

body:
- type: checkboxes
  id: sdk-docs-checked
  attributes:
    label: I have checked that the [SDK documentation][sdk-docs] doesn't solve my issue.
    options:
      - label: Yes
  		required: true
- type: checkboxes
  id: api-docs-checked
  attributes:
    label: I have checked that the [API documentation][api-docs] doesn't solve my issue.
    options:
      - label: Yes
        required: true
- type: checkboxes
  id: dev-forums-checked
  attributes:
    label: I have searched the [Box Developer Forums][dev-forums] and my issue isn't already reported (or if it has been reported, I have attached a link to it, for reference).
    options:
      - label: Yes
        required: true
- type: checkboxes
  id: github-repo-checked
  attributes:
    label: I have searched [Issues in this repo][github-repo] and my issue isn't already reported.
    options:
      - label: Yes
        required: true
---
- type: input
  id: version
  attributes:
    label: Bug prevalence
    description: "What is Box CLI Version used?"
    validations:
      required: true
- type: input
  id: node-version
  attributes:
    label: Node Version
    description: "What is your Node and NPM version?"
    validations:
      required: true
- type: input
  id: node-version
  attributes:
    label: Operating system
    description: "What is your Operating  System Version?"
    validations:
      required: true
---
- type: textarea
  id: description
  attributes:
    label: Describe the bug
    description: Replace this text with a description of what problem you're having. 
      Please include as much detail as possible to help us troubleshoot! 
        - Authentication method used in your application
        - App Access Level (found in application configuration):  App Access Only | App + Enterprise Access
        - Are you using service account or user account? https://developer.box.com/guides/getting-started/user-types/service-account/
        - Share the full error output you're seeing, if applicable.
        - Please include the full stack trace to help us identify where the error is happening.  
    validations:
      required: true
- type: textarea
  id: description
  attributes:
    label: Steps to reproduce
    description: Good steps to reproduce the problem help speed up debugging for us and gets your issue resolved sooner!
    validations:
      required: true
- type: textarea
  id: description
  attributes:
    label: Expected behavior
    description: What did you expect to happen?
    validations:
      required: true

[sdk-docs]: /docs
[api-docs]: https://developer.box.com/docs
[dev-forums]: https://community.box.com/t5/Platform-and-Development-Forum/bd-p/DeveloperForum
[github-repo]: https://github.com/box/boxcli/search?type=Issues
