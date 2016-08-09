 //Timesheet code //////////////////////////////////////////////////////////////////////////////////////////////////
  var TIMESHEET_ENTRY_ID_PREFIX = "TimeEntry_";
  var SECONDS_IN_MINUTE = 60;
  var SECONDS_IN_HOUR = 3600;
  var TIME_FIELD_LENGTH = 10;
  
  function Timesheet(){
	this.entryList = new Array();
	this.activeEntry = null;
	this.totalTime = 0;//seconds
	this.activeEntryTime = 0;//seconds
  }
  
  Timesheet.prototype.addEntry = function(name){
	//need validation and scrubbing of name 
	//scrub sql and check for duplicates
	var newEntry = new TimesheetEntry(name);
	newEntry.setId(TIMESHEET_ENTRY_ID_PREFIX + new Date().getTime() + this.entryList.length + 1);
	this.entryList.push(newEntry);
	return newEntry != null ? newEntry.getId() : null; //need to return false if validation of entry creation fails
  }
  
  Timesheet.prototype.getEntryCount = function(){
	return this.entryList.length;
  }
  
  Timesheet.prototype.getActiveEntry = function(){
	return this.activeEntry;
  }
  
  Timesheet.prototype.deactivateAllEntries = function(){
  	for (var x = 0; x < this.entryList.length; x++) {
		if (this.entryList[x] != null && this.entryList[x].isActive()) {
			this.entryList[x].deactivate();
		}
	}
	this.activeEntry = null;
  }
  
  Timesheet.prototype.activateEntryToggle = function(id){
	var isActive = this.activeEntry === this.getEntryById(id);
	this.deactivateAllEntries();
	
	if (!isActive) {
		this.activeEntry = this.getEntryById(id);
		if (this.activeEntry != null && !this.activeEntry.isActive()) {
			this.activeEntry.activate();
			return true;
		}
	}
	return false;
  }

  Timesheet.prototype.getEntryById = function(id){
	for (var x = 0; x < this.entryList.length; x++) {
		if (this.entryList[x] != null && this.entryList[x].getId() == id) {
			return this.entryList[x];
		}
	}
	return null;
  }

  Timesheet.prototype.deleteEntryById = function(id){
	for (var x = 0; x < this.entryList.length; x++) {
		if (this.entryList[x] != null && this.entryList[x].getId() == id) {
			if (this.activeEntry === this.entryList[x]) {
				this.activeEntry = null;
			}
			this.entryList.splice(x, 1);
		}
	}
	return null;
  }

  Timesheet.prototype.updateTimes = function(){
   var dateNow = new Date();
   this.totalTime = 0;
   this.activeEntryTime = 0;
	for (var x = 0; x < this.getEntryCount(); x++) {
		if (this.entryList[x] != null) {
			var entryTime = this.entryList[x].getTotalTime(dateNow)
			this.totalTime += entryTime;
			if (this.hasActiveEntry && this.entryList[x] === this.getActiveEntry()) {
				this.activeEntryTime = entryTime;
			}
		}
	}
  }
  
  Timesheet.prototype.getTotalTime = function(){
	return this.totalTime;
  }
  
  Timesheet.prototype.getActiveEntryTime = function(){
	return this.activeEntryTime;
  }  
  
  Timesheet.prototype.hasActiveEntry = function(){
	return this.activeEntry != null;
  }
  
 
 //Timesheet Entry code //////////////////////////////////////////////////////////////////////////////////////////////////
  function TimesheetEntry(name){
	this.name = name;
	this.storedTime = 0; //stored in seconds
	this.currentActiveTime = 0;//stored in seconds
	this.start = null;
	this.paused = true;
  }
  
  TimesheetEntry.prototype.getName = function(){
	return this.name;
  }   
  
  TimesheetEntry.prototype.setName = function(name){
	this.name = name;
  } 
  
  TimesheetEntry.prototype.getId = function(){
	return this.id;
  }
  
  TimesheetEntry.prototype.setId = function(id){
	this.id = id;
  }
  
  TimesheetEntry.prototype.getTotalTime = function(dateNow){
	if (!this.paused && this.start != null) {
		this.currentActiveTime = Math.ceil( (dateNow.getTime() - this.start.getTime())/1000 );
	}
  	return this.storedTime + this.currentActiveTime;
  }
    
  TimesheetEntry.prototype.activate = function(){
    this.start = new Date();
	this.paused = false;
  }
  
  TimesheetEntry.prototype.deactivate = function(){
//	if (!this.paused && this.start != null) {
//		this.storedTime += (new Date().getTime() - this.start.getTime());
//	}
	this.storedTime += this.currentActiveTime;
	this.currentActiveTime = 0;
	this.start = null;
	this.paused = true;
  }
  
  TimesheetEntry.prototype.isActive = function(){
	return this.startDate != null || !this.paused;
  }
  
  //utility functions/////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function getFormattedTime(seconds){
	if (seconds == 0 || seconds == null || seconds == NaN || seconds == undefined) {
		return padLeft('', TIME_FIELD_LENGTH);
	}
	
	var hours = Math.floor(seconds / SECONDS_IN_HOUR);
	var minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
	var secs = Math.floor(seconds % SECONDS_IN_MINUTE);
	
	var timeString = formatSecondsOrMinutes(secs, minutes > 0 || hours > 0);
	if (minutes > 0 || hours > 0) {
		timeString = formatSecondsOrMinutes(minutes, hours > 0) + ":" + timeString;
	} 
	if (hours > 0) {
		timeString = formatSecondsOrMinutes(hours, false) + ':' + timeString;
	}
	return padLeft(timeString, TIME_FIELD_LENGTH);
  }
  
  function formatSecondsOrMinutes(value, includeZero){
	return value < 10 ? (includeZero ? '0' : ' ') + value : value;
  }
  
  function padLeft(string, length){	
	for (var x = 0; x <= length - string.length; x++) {
		string = " " + string;
	}
	return string;
  }