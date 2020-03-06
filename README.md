# data-source-feedback
Hackathon project

## Purpose  
Sending feedback to data custodians when observations are found with the data.

## Usage  

### API Access  
Request one in the Common Service [GETOK application](https://getok-master-k8vopl-prod.pathfinder.gov.bc.ca/)  

### Installation  
Download code, npm link it

```
cd ~/data-source-feedback
npm i
npm link
```

In your project, npm link to the library
```
cd ~/my-project
npm link data-source-feedback
npm i
```
Review the data-source-feedback/example.js. 
Set environment variables for CHES_CLIENT_ID and CHES_CLIENT_SECRET  

 
### Implementation  
An example for implementation in your app is provided 
```
data-source-feedback/example.js
``` 
 

