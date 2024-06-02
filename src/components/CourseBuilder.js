import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Module from "./Module";
import "./CourseBuilder.css";
import { FaPlus } from "react-icons/fa";
import image_land from "./landing-image.jpg";

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDisplayName, setLinkDisplayName] = useState("");

  const handleAddModule = () => {
    setShowModal(true);
  };

  const handleConfirmAddModule = () => {
    const existingModule = modules.find(
      (module) => module.title.toLowerCase() === moduleName.toLowerCase()
    );
    if (existingModule) {
      setWarningMessage("Module name already exists. Please choose another name.");
      return;
    }

    const newModuleTitle = moduleName ? moduleName : `Module ${modules.length + 1}`;
    const newModule = {
      id: `module-${Date.now()}`,
      title: newModuleTitle,
      resources: [],
    };
    setModules([...modules, newModule]);
    setFeedbackMessage("Module added");
    setTimeout(() => setFeedbackMessage(""), 3000);
    setShowModal(false);
    setModuleName("");
    setShowMenu(false); // Hide the menu after adding a module
    setWarningMessage("");
  };

  const handleCancelAddModule = () => {
    setShowModal(false);
    setModuleName("");
    setWarningMessage("");
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(modules);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setModules(items);
    } else {
      const sourceModuleIndex = modules.findIndex(
        (module) => module.id === source.droppableId
      );
      const destModuleIndex = modules.findIndex(
        (module) => module.id === destination.droppableId
      );
      const sourceModule = modules[sourceModuleIndex];
      const destModule = modules[destModuleIndex];
      const sourceResources = Array.from(sourceModule.resources);
      const destResources = Array.from(destModule.resources);
      const [movedResource] = sourceResources.splice(source.index, 1);
      destResources.splice(destination.index, 0, movedResource);
      const newModules = Array.from(modules);
      newModules[sourceModuleIndex] = {
        ...sourceModule,
        resources: sourceResources,
      };
      newModules[destModuleIndex] = { ...destModule, resources: destResources };
      setModules(newModules);
    }
  };

  const handleAddLink = (moduleIndex) => {
    setShowLinkModal(true);
  };

  const handleConfirmAddLink = (moduleIndex) => {
    const newLink = {
      url: linkUrl,
      displayName: linkDisplayName,
    };

    const newModules = [...modules];
    newModules[moduleIndex].resources.push(newLink);
    setModules(newModules);
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkDisplayName("");
  };

  const handleCancelAddLink = () => {
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkDisplayName("");
  };

  return (
    <div className="course-builder">
      <h1>Course Builder</h1>
      <button className="add-module" onClick={handleToggleMenu}>
        <FaPlus className="fa-plus" style={{ marginRight: "8px" }} /> Add
      </button>
      {showMenu && (
        <div className="menu">
          <button onClick={handleAddModule} className="redadd">
            <FaPlus
              style={{ marginRight: "8px", backgroundColor: "transparent" }}
            />{" "}
            Create Module
          </button>
        </div>
      )}
      {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}
      {modules.length === 0 && (
        <div className="placeholder-image">
          <img src={image_land} alt="Placeholder" />
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-modules" type="module">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {modules.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Module
                        module={module}
                        setModules={setModules}
                        modules={modules}
                        setFeedbackMessage={setFeedbackMessage}
                        handleAddLink={() => handleAddLink(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enter Module Name</h2>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Module name"
            />
            {warningMessage && <div className="warning">{warningMessage}</div>}
            <div className="modal-buttons">
              <button onClick={handleConfirmAddModule} className="confirm-button">
                Add Module
              </button>
              <button onClick={handleCancelAddModule} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showLinkModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Add New Link</h2>
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="Link URL"
      />
      <input
        type="text"
        value={linkDisplayName}
        onChange={(e) => setLinkDisplayName(e.target.value)}
        placeholder="Display Name"
      />
      <div className="modal-buttons">
        <button onClick={handleConfirmAddLink} className="confirm-button">
          Add Link
        </button>
        <button onClick={handleCancelAddLink} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CourseBuilder;
