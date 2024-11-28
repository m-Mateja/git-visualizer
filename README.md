## Process and Solution
Git Visualizer was created to clone a remote repository, allow changes to files, and then commit these changes back all in one platform. 

This is achieved by sending a POST request with a desired git url, and using the simply-git library to clone that repository. 

The repo is cloned in a directory which is one level higher than the working project in the tree. This ensures that the repo was cloned to a local directory, but also prevents the repo from being identified as belonging to the Git Visualizer project. 

The files and folders can now be accessed and viewed using the react-folder-tree library. When a file name is clicked, a text-area element and 'save file' button appear. 

The file can now be edited in the text-area, and saved via the button. 

Clicking the 'save file' button will trigger a PUT request, which will grab the local path and contents of the file, and run git add/commit using simply-git. 

This completes the whole workflow, and the repo is re-captures with a GET request for the most up to date file information.

## Workflow
User inputs git url -> clicks clone repository -> POST (create directory, clone project) -> GET (return cloned repo) -> PUT (save edited file/path) -> GET (return updated repo)

## Requirements 
- Install npm
- Create a directory and git clone this project

## Running Git Visualizer
- For main project:
```bash
npm run dev
```

- For Unit Testing:
```bash
npm run test
```
