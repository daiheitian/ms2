import React, {useState, useEffect } from 'react';
import { Editor, EditorState, CompositeDecorator } from 'draft-js'

const HASHTAG_REGEX = /\@[\w]+/g;

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: hashtagStrategy,
    component: (props) => <span {...props} style={{color:'red'}}>{props.children}</span>,
  },
]);

function LabelEditor({value, onChange}) {
  const [editorValue, setValue] = useState(EditorState.createEmpty(compositeDecorator))


  useEffect(()=>{

  }, [])


  const onEditorChange = (val) => {
    setValue(val)
    if(onChange) {
      onChange(val)
    }
  }

  return (<Editor editorState={editorValue} onChange={onEditorChange} />
  );
}

export default LabelEditor;
