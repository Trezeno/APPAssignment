/* My button and job list click event listeners */
document.getElementById("jobList").addEventListener('click', highlightJob);
document.getElementById("deleteJobButton").addEventListener('click', deleteJob);
document.getElementById("addJobButton").addEventListener('click', addJob);
document.getElementById("updateListButton").addEventListener('click', updateList);

/* Event listener to grab the value of the Add a Job: "Job Date:" date input section whenever it is changed */
document.getElementById("jobDateAdd").addEventListener("change", function() {
  let dateInput = this.value;
  console.log("New date changed to: " + dateInput);
});

/* Event listener that checks for change in the "Sort By:" selection above the Job List */
document.getElementById("filterOptions").addEventListener("change", function(e) {
  let filterOption = e.target.value;
  console.log("Filter has been changed to: " + filterOption);
  switch(filterOption) {
    case "filterNumber":
      //Sort job list by number here
      getJobListByNumber();
      break;
    case "filterDate":
      //Sort job list by date here
      getJobListByDate();
      break;
    case "filterPriority":
      //Sort job list by priority here
      getJobListByPriority();
      break;
    default:
      //Debugging
      console.log("Some error has occured somewhere");
      break;
  }
});

/* My event listener checking for the change of "Job Priority" select box when adding a job */
let jobPrioToAdd = "";
document.getElementById("priorityOptions").addEventListener("change", function(e) {
  jobPrioToAdd = e.target.value.toUpperCase();
  console.log("Add job priority changed to: " + jobPrioToAdd);
});

/* My event listener for when the webpage is loaded each time - Pulls data from the job_list.json file and displays it */
document.addEventListener("DOMContentLoaded", function() {
  console.log("Loading page for first time..");
  getJobListByNumber();
});


/* Function to get full jobs list from json file and show on screen ordered by number
   It user XHR to create a GET request from the server and pull the data from job_list.json and
   displays it, ordered by the Jobs ID (This is how is it defautly stored in the .json file) */
function getJobListByNumber() {
  console.log("Getting full job list data sorted by number:");
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("xhr request success");
      let jobListResult = JSON.parse(this.responseText);
      let jobList = "";
      for (let job of jobListResult.jobList) {
        jobList = jobList + "<li id='" + job.jobId + "' jobName='" + job.jobName + "' jobDate='" + job.jobDate + "' jobPriority='" + job.jobPriority + "'>" + job.jobName + "</li>";
      }
      document.getElementById("jobList").innerHTML = jobList;
    } else {
      console.log("xhr request problem has occured");
    }
  }
  xhr.open("GET", "/api/jobs", true);
  xhr.send();
}

/* Function to get full jobs list from json file and show on screen ordered by date
   It user XHR to create a GET request from the server and pull the data from job_list.json and
   loops through it, creating a new array with the ordered due dates from earliest to latest
   It then references this sorted job list and displayed each job in order of earliest due to latest due */
function getJobListByDate() {
  console.log("Getting full job list data sorted by priority:");
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("xhr request success");
      let jobListResult = JSON.parse(this.responseText);
      // Rearranged jobListResult by date here
      let sortedJobListDate = [];
      let jobListByDateComplete = [];
      for (let job of jobListResult.jobList) {
        sortedJobListDate.push(job.jobDate);
      }
      sortedJobListDate.sort();
      let timesAdded = 0;
      for (let date of sortedJobListDate) {
        for (let job of jobListResult.jobList) {
          if (job.jobDate == date && timesAdded < sortedJobListDate.length) {
            jobListByDateComplete.push("<li id='" + job.jobId + "' jobName='" + job.jobName + "' jobDate='" + job.jobDate + "' jobPriority='" + job.jobPriority + "'>" + job.jobName + "\t(" + job.jobDate + ")" + "</li>");
            timesAdded++;
          }
        }
      }
      let dateJobList = "";
      for (job of jobListByDateComplete) {
        dateJobList = dateJobList + job;
      }
      document.getElementById("jobList").innerHTML = dateJobList;
    } else {
      console.log("xhr request problem has occured");
    }
  }
  xhr.open("GET", "/api/jobs", true);
  xhr.send();
}

/* Function to get full jobs list from json file and show on screen ordered by priority
   It user XHR to create a GET request from the server and pull the data from job_list.json and
   loops through it, creating a new array which will house all jobs with priority ordered High > Medium > Low
   It then loops through our json file and puts in every High priority, followed by Medium and then Low*/
function getJobListByPriority() {
  console.log("Getting full job list data sorted by priority:");
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("xhr request success");
      let jobListResult = JSON.parse(this.responseText);
      // Rearranged jobListResult by priority will go here
      let sortedJobListPriority = [];
      for (let job of jobListResult.jobList) {
        if (job.jobPriority == "HIGH") {
          sortedJobListPriority.push("<li id='" + job.jobId + "' jobName='" + job.jobName + "' jobDate='" + job.jobDate + "' jobPriority='" + job.jobPriority + "'>" + job.jobName + "\t(" + job.jobPriority + ")" + "</li>");
        }
      }
      for (let job of jobListResult.jobList) {
        if (job.jobPriority == "MEDIUM") {
          sortedJobListPriority.push("<li id='" + job.jobId + "' jobName='" + job.jobName + "' jobDate='" + job.jobDate + "' jobPriority='" + job.jobPriority + "'>" + job.jobName + "\t(" + job.jobPriority + ")" + "</li>");
        } 
      }
      for (let job of jobListResult.jobList) {
        if (job.jobPriority == "LOW") {
          sortedJobListPriority.push("<li id='" + job.jobId + "' jobName='" + job.jobName + "' jobDate='" + job.jobDate + "' jobPriority='" + job.jobPriority + "'>" + job.jobName + "\t(" + job.jobPriority + ")" + "</li>");
        }
      }
      let priorityJobList = "";
      for (job of sortedJobListPriority) {
        priorityJobList = priorityJobList + job;
      }
      document.getElementById("jobList").innerHTML = priorityJobList;
    } else {
      console.log("xhr request problem has occured");
    }
  }
  xhr.open("GET", "/api/jobs", true);
  xhr.send();
}

/* Function to clear the "Highlighted Job" section when clicking another job to highlight */
function clearHighlightedJob() {
  document.getElementById("jobIdShow").value = "";
  document.getElementById("jobNameShow").value = "";
  document.getElementById("jobDateShow").value = "";
  document.getElementById("jobPriorityShow").value = "";
  console.log("Highlighted job info cleared");
}

/* Function that will display selected job information when clicking on a job list icon */
function highlightJob(e) {
  clearHighlightedJob();
  let jobId = e.target.id
  let jobName = e.target.getAttribute("jobName");
  let jobDate = e.target.getAttribute("jobDate");
  let jobPriority = e.target.getAttribute("jobPriority");
  console.log("Job highlighted: ", jobId, jobName, jobDate, jobPriority);
  document.getElementById("jobIdShow").value = jobId;
  document.getElementById("jobNameShow").value = jobName;
  document.getElementById("jobDateShow").value = jobDate;
  document.getElementById("jobPriorityShow").value = jobPriority;
}

/* Function that will delete selected job and re-arrange all subsequent job IDs after the one deleted by -1 
   to allow for when adding another job that no IDs are duplicated and clash */
function deleteJob() {
  console.log("Delete button pressed")
  let jobToDelete = document.getElementById("jobIdShow").value;
  if (jobToDelete == 1) {
    alert("Cannot delete testJob. This is baseline to test everything. Feel free to add more and delete those.");
  } else if (jobToDelete != "" && jobToDelete != "jobList") {
    console.log("Deleting Job Number: " + jobToDelete);
    document.getElementById(jobToDelete).remove();
    //Remove deleted details from selected box too
    clearHighlightedJob();
    //Reset all Job IDs in the list to re-organise itself
    jobListArray = document.getElementById("jobList").children;
    for (let i = 0; i < jobListArray.length; i++) {
      if (jobListArray[i].id > jobToDelete)
      jobListArray[i].id = jobListArray[i].id - 1;
    }
    console.log("Job list and their respective IDs have been reorganised.")
    alert("Job has been deleted clientside. Update to save changes.");
  } else {
    alert("Make sure you have highlighted a job before trying to delete.");
  }
}

/* Function that will add a job to my job list which checks a few extra things:
    - Ensures date entry is not in the past
    - Ensures data entry is present in Job Name, Job Date and Job Priority fields 
    - Ensures Job Priority only includes the word "high", "medium" or "low" */
function addJob() {
  console.log("Add button pressed");
  let addJobName = document.getElementById("jobNameAdd").value;
  let addJobDate = document.getElementById("jobDateAdd").value;
  let addJobPriority = jobPrioToAdd;
  let currentTime = new Date();
  let fullDateToAdd = new Date(addJobDate);
  if (fullDateToAdd < currentTime) {
    alert("Incorrect date entry. Cannot add a To-Do job in the past!");
  } else if (addJobDate == "") {
    alert("Please enter a date for your entry");
  } else if (addJobName == "" || addJobPriority == "") {
    alert("Missing data field in either Job Name OR Job Priority");
  } else {
    let newJob = document.createElement('li');
    newJob.id = document.getElementById("jobList").childElementCount + 1;
    newJob.setAttribute("jobId", newJob.id);
    newJob.setAttribute("jobName", addJobName);
    newJob.setAttribute("jobDate", addJobDate);
    newJob.setAttribute("jobPriority", addJobPriority);
    newJob.innerText = addJobName;
    document.getElementById("jobList").appendChild(newJob);
    alert("Job should be added clientside - Press UPDATE button to save changes.");
    //Removing contents from input boxes when successfully added
    document.getElementById("jobNameAdd").value = "";
    document.getElementById("jobDateAdd").value = "";
  }
}

/* Function that will update my list once changes have been made by sorting all list elements by
   id from 1 - X before sending the data back to the server. Once it has done this and filled the
   jobList which will be uploaded and sent back, we create a XHR and PUT the data back to the
   server where it will replace the .json file in /data/ with any new changes that were made */
function updateList() {
  console.log("Update button pressed");
  let jobEntries = document.getElementsByTagName("li");
  let uploadObject = {};
  uploadObject.jobList = [];
  let idToFind = 1;
  while (uploadObject.jobList.length < jobEntries.length) {
    for (let job of jobEntries) {
      if (job.id == idToFind) {
        let jobEntry = {};
        jobEntry.jobId = job.id
        jobEntry.jobName = job.getAttribute("jobName");
        jobEntry.jobDate = job.getAttribute("jobDate");
        jobEntry.jobPriority = job.getAttribute("jobPriority");
        uploadObject.jobList.push(jobEntry);
      }
    }
    idToFind++;
  }
  let xhr = new XMLHttpRequest();
  let url = "/api/jobs";
  xhr.onreadystatechange = function() {
    let strResponse = "Error: no response";
    if (this.readyState == 4 && this.status == 200) {
      strResponse = JSON.parse(this.responseText);
      alert(strResponse.message);
    }
  };
  xhr.open("PUT", url, true);
  var data = JSON.stringify(uploadObject);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

