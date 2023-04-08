// Runs when the document this script is bound to is opened. Adds TileNote menu to Google Docs UI
function onOpen()
{
  // Get the UI of the active document
  var ui = DocumentApp.getUi();
  
  // Create a new menu for TileNote and add it to the document UI
  ui.createAddonMenu()
  .addItem('Open sidebar', 'openSidebar')
  .addToUi();
}

// Opens the TileNote Menu: Called from Google Docs UI
function openSidebar()
{
  // Create a new HTML template object from the 'Sidebar' file
  var html = HtmlService.createTemplateFromFile('Sidebar');
  
  // Evaluate the HTML template to generate the sidebar
  var sidebar = html.evaluate();
  
  // Set the title of the sidebar
  sidebar.setTitle('TileNote');
  
  // Show the sidebar in the document UI
  DocumentApp.getUi().showSidebar(sidebar);
}

// Adds a button to the active tile set
function createButton(name, content)
{
  // Get the properties of the active document
  var properties = PropertiesService.getDocumentProperties();
  
  // Get the name of the active tile set
  var activeTileSet = properties.getProperty("activeTileSet");
  
  // Get the buttons for the active tile set
  var buttons = JSON.parse(properties.getProperty(activeTileSet) || "[]");
  
  // Create a new button object with the provided name and content
  var newButton =
  {
    name: name,
    content: content
  };
  
  // Add the new button to the list of buttons for the active tile set
  buttons.push(newButton);
  
  // Save the updated list of buttons to the properties of the active document
  properties.setProperty(activeTileSet, JSON.stringify(buttons));
  
  // Return the newly created button object
  return newButton;
}

// Loads the buttons for the active tile set
function loadButtons()
{
  // Get the properties of the active document
  var properties = PropertiesService.getDocumentProperties();
  
  // Get the name of the active tile set
  var activeTileSet = properties.getProperty("activeTileSet");
  
  // Get the buttons for the active tile set
  var buttons = JSON.parse(properties.getProperty(activeTileSet) || "[]");
  
  // Return the list of buttons for the active tile set
  return buttons;
}

// Creates a new tile set name and saves it to the document properties
function createTileSetName(tileSetName)
{
  var properties = PropertiesService.getDocumentProperties();
  
  // Load the current tile set names from the document properties
  var tileSetNames = JSON.parse(properties.getProperty("tileSets") || "[]");
  
  // Check if the new tile set name is unique
  var isUnique = true;
  for (let i = 0; i < tileSetNames.length; ++i)
  {
    if (tileSetName === tileSetNames[i])
    {
      isUnique = false;
      break;
    }
  }

  if (isUnique == true)
  {
    // Add the new tile set name to the list of tile set names
    tileSetNames.push(tileSetName);
    properties.setProperty("tileSets", JSON.stringify(tileSetNames));
    
    // Set the active tile set to the newly created tile set
    setTileSetSelection(tileSetName);
    return tileSetName;
  }
  else
  {
    // Throw Error if tile set name already exists
    throw new Error("Tile set name already exists");
  }
}

// Loads the list of tile set names from the document properties
function loadTileSetNames()
{
  var properties = PropertiesService.getDocumentProperties();
  var tileSetNames = JSON.parse(properties.getProperty("tileSets") || "[]");
  return tileSetNames;
}

// Sets the active tile set in the document properties
function setTileSetSelection(tileSetName)
{
  var properties = PropertiesService.getDocumentProperties();
  var tileSetNames = JSON.parse(properties.getProperty("tileSets") || "[]");
  var isValid = false;
  
  // Check if the provided tile set name is valid
  for (let i = 0; i < tileSetNames.length; ++i)
  {
    if (tileSetName === tileSetNames[i])
    {
      isValid = true;
      break;
    }
  }

  if (isValid == true)
  {
    // Set the active tile set in the document properties
    properties.setProperty("activeTileSet", tileSetName);
  }
  else
  {
    //Throw error if the tile set name is invalid
    throw new Error("Invalid tile set name");
  }
}

// Deletes all document properties
function clearProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  properties.deleteAllProperties();
}


/**
 * Replaces the text of the current selection with the provided text, or
 * inserts text at the current cursor location. (There will always be either
 * a selection or a cursor.) If multiple elements are selected, only inserts the
 * translated text in the first element that can contain text and removes the
 * other elements.
 *
 * @param {string} newText The text with which to replace the current selection.
 */
// Sourced from: https://developers.google.com/apps-script/add-ons/editors/docs/quickstart/translate#translate.gs on 4/7/23

function insertText(newText) {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    let replaced = false;
    const elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
      DocumentApp.ElementType.INLINE_IMAGE) {
      throw new Error('Can\'t insert text into an image.');
    }
    for (let i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        const element = elements[i].getElement().asText();
        const startIndex = elements[i].getStartOffset();
        const endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          var document = DocumentApp.getActiveDocument();
          var textElement = cursor.getElement();
          var textOffset = cursor.getOffset();
          var position = document.newPosition(textElement, textOffset + 1);
          document.setCursor(position);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          const parent = element.getParent();
          const remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        const element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only replace elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    const cursor = DocumentApp.getActiveDocument().getCursor();
    const surroundingText = cursor.getSurroundingText().getText();
    const surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) !== ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) !== ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
    var document = DocumentApp.getActiveDocument();
    var textElement = cursor.getElement();
    var textOffset = cursor.getOffset();
    var position = document.newPosition(textElement, textOffset + 1);
    document.setCursor(position);
  }
}