Set qtApp = CreateObject("quicktest.application")
    
' Create an array containing the list of addins associated with this test
arrTestAddins = qtApp.GetAssociatedAddinsForTest(Environment("TestDir")) 
' Check if all required add-ins are all already loaded
blnNeedChangeAddins = False ' Assume no change is necessary
missing_addins = ""
For Each testAddin In arrTestAddins ' Iterate over the test's associated add-ins list
	addin_status = qtApp.Addins(testAddin).Status
	If (addin_status <> "Active") Then ' If an associated add-in is not loaded
		Reporter.ReportEvent micWarning, "Add-in", testAddin & " addin is NOT LOADED with UFT."
	Else
		Reporter.ReportEvent micDone, "Add-in", testAddin & " addin is LOADED with UFT."
	End If
Next

On Error Resume Next
SystemUtil.CloseProcessByName "chrome.exe"
On Error GoTo 0

CTLHomeURL = "https://www.lumen.com/en-us/home.html"
SystemUtil.Run "chrome.exe", CTLHomeURL, "C:\", "", 3
If Browser("name:=Enterprise Technology for the Digital Revolution \| Lumen").Exist(7) Then
	If Browser("name:=Enterprise Technology for the Digital Revolution \| Lumen").Page("title:=Enterprise Technology for the Digital Revolution \| Lumen").Exist(0) Then
		Browser("name:=Enterprise Technology for the Digital Revolution \| Lumen").Page("title:=Enterprise Technology for the Digital Revolution \| Lumen").Link("text:=Self-service Products ", "index:=0").Click
		Browser("name:=Self-Service Solutions \| Lumen").Close
	Else
		Reporter.ReportEvent micWarning, "Page not identified", "Page NOT identified"
		Reporter.ReportEvent micDone, "Opened Browser", "Open browser name is : " & Browser("CreationTime:=0").Page("title:=.*").GetROProperty("title")
		Browser("CreationTime:=0").Close
	End If
Else
	Reporter.ReportEvent micDone, "Opened Browser", "Open browser name is : " & Browser("CreationTime:=0").GetROProperty("name")
	Browser("CreationTime:=0").Close
End If
