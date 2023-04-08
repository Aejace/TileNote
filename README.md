# TileNote

Here is a link so you can clone the bound document to use for yourself!
https://docs.google.com/document/d/1l5k-GeTgf_8be0x_Ea_Re0elqt1Or7XnnvlQR-JGvB0/edit?usp=sharing

Summary
The project consists of a Google Docs add-on that allows users to create and manage sets of custom "tiles" containing text snippets that can be inserted into their document with a single click. The add-on provides a sidebar interface for managing tile sets and individual tiles, as well as a menu for inserting tiles into the document.

Users can create and name new tile sets, add and remove individual tiles, and select an active tile set for use in their document. The add-on stores tile set and tile data using Google Docs PropertiesService, allowing the data to persist between sessions.

The code is written in Google Apps Script, a JavaScript-based scripting language for Google services.

Technical Documentation
Architecture
The code for the project is structured around a few key functions:

onOpen(): Called when the Google Docs document is opened. Adds a custom menu to the document UI.

openSidebar(): Opens the TileNote sidebar interface when called from the custom menu.

createButton(): Adds a new tile to the active tile set. Takes a name and content string as arguments.

loadButtons(): Returns an array of objects containing the name and content of each tile in the active tile set.

createTileSetName(): Adds a new tile set with the given name, if the name is unique. If the name is not unique, throws an error.

loadTileSetNames(): Returns an array of strings containing the names of all tile sets.

setTileSetSelection(): Sets the active tile set to the given name, if the name corresponds to an existing tile set. If the name is not valid, throws an error.

clearProperties(): Deletes all document properties associated with the add-on.

Data Storage
The add-on uses Google Docs PropertiesService to store tile set and tile data. Each tile set is stored as a JSON string under a property key named after the tile set name. The active tile set name is stored as a string under the property key "activeTileSet". An array of strings representing the names of all tile sets is stored as a JSON string under the property key "tileSets".

User Interface
The add-on provides a sidebar interface for managing tile sets and individual tiles. The sidebar is implemented using HTML and CSS, with dynamic content loaded using Google Apps Script. The sidebar includes forms for creating and selecting tile sets, as well as a list of all tiles in the active tile set.

The add-on also adds a custom menu to the Google Docs UI. The menu includes a single option to open the TileNote sidebar.

Error Handling
The add-on includes basic error handling for certain actions, such as attempting to add a duplicate tile set or selecting a non-existent tile set. In these cases, an error message is displayed to the user in the sidebar.

Security
The add-on requires users to grant permission for certain actions, such as creating and deleting document properties. Users can view and manage the permissions granted to the add-on through the Google Account settings page.

Overall, the TileNote add-on provides a simple and user-friendly way for Google Docs users to manage and use custom text snippets in their documents.
