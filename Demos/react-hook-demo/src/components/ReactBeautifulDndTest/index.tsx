import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './index.module.scss';

// tutorial: https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/#step-2-making-a-list-draggable-and-droppable-with-react-beautiful-dnd
// copy from https://github.com/colbyfayock/my-final-space-characters

const finalSpaceCharacters = [
	{
	  id: 'gary',
	  name: 'Gary Goodspeed',
	  thumb: '/logo192.png'
	},
	{
	  id: 'cato',
	  name: 'Little Cato',
	  thumb: '/logo192.png'
	},
	{
	  id: 'kvn',
	  name: 'KVN',
	  thumb: '/logo192.png'
	},
	{
	  id: 'mooncake',
	  name: 'Mooncake',
	  thumb: '/logo192.png'
	},
	{
	  id: 'quinn',
	  name: 'Quinn Ergon',
	  thumb: '/logo192.png'
	}
  ]

const ReactBeautifulDndTest: React.FunctionComponent<{}> = function (props) {
	const [characters, updateCharacters] = useState(finalSpaceCharacters);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Final Space Characters</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className={styles.characters} {...provided.droppableProps} ref={provided.innerRef}>
                {characters.map(({id, name, thumb}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className={styles.charactersThumb}>
                            <img src={thumb} alt={`${name} Thumb`} />
                          </div>
                          <p>
                            { name }
                          </p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );
}

export default ReactBeautifulDndTest

