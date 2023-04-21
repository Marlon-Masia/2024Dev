import React from 'react'
import { useState } from "react";
import { Table, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

import Term from './Term';
import Phrase from './Phrase';
import Question from './Question';
import MentorQuestion from './MentorQuestion';

const updateMentorFrequency = (e, curModule, updateCurrentModule, serviceIP) => {
  e.preventDefault();
  let data = {
    question_frequency : parseInt(e.target.frequency.value),
    module_id : curModule.moduleID
  };

  let header = {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
  };

  axios.post(serviceIP + '/modifymentorquestionfrequency', data, header)
  .then(res => {
    //updateCurrentModule({ module: curModule.moduleID });
  })
  .catch(error => {
    console.log("updateMentorFrequency error: ", error.response);
  })
}

const CardList = (props) => {
    const [freq, setFreq] = useState(props.curModule.mentorQuestionFrequency);
    const [moduleid, setModuleid] = useState(props.curModule.moduleID);
    const removeDuplicates = () => {
      let idList = []; 
      let filteredList = []; 

      props.cards.map((card) => 
      {
          if (idList.indexOf(card.termID) === -1) {
            idList.push(card.termID); 
            filteredList.push(card);
          }
      })
      return filteredList; 
    }
    
    //if the module has changed, change the frequency
    if (props.curModule.moduleID != moduleid) {
      setFreq(props.curModule.mentorQuestionFrequency);
      setModuleid(props.curModule.moduleID);
    }

    let list = removeDuplicates(); 
    let len = list.length; 

    if (props.type === 0) {
	    return (
        <div>
        {len === 0 ? 
          <Alert> There are currently no terms in this module. </Alert>
        : 
        <Table hover className="tableList">
          <thead>
            <tr>
              <th style={{width: '32%'}}>English</th>
              <th style={{width: '32%'}}>Translated</th>
              <th style={{width: '12%'}}>Type</th>
              <th style={{width: '12%'}}>Gender</th>
              <th style={{width: '12%'}}>Picture</th>
              <th style={{width: '12%'}}>Audio</th>
              {props.permissionLevel !== "st" ? <th style={{width: '32%'}}> </th> : null}
            </tr>
          </thead>
          <tbody>
            {list.map((card) => {
              return (
                <Term
                  key={card.termID}
                  card={card}
                  currentClass={props.currentClass}
                  permissionLevel={props.permissionLevel}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}
                  deleteTag={props.deleteTag}
                  addTag={props.addTag}
                  allTags={props.allTags}
                />
              )
            })}
          </tbody>
        </Table>
        }
        </div>
      )
    }
    else if (props.type === 1) {
      return (
        <div>
        {len === 0 ? 
          <Alert> There are currently no phrases in this module. </Alert>
        : 
        <Table hover className="tableList">

          <thead>
            <tr>
              <th style={{width: '32%'}}>Phrase (English)</th>
              <th style={{width: '32%'}}>Phrase (Translated)</th>
              <th style={{width: '12%'}}>Picture</th>
              <th style={{width: '12%'}}>Audio</th>
              {props.permissionLevel !== "st" ? <th style={{width: '32%'}}> </th> : null}
            </tr>
          </thead>
          <tbody>
            {list.map((card) => {
              return (
                <Phrase                   
                  key={card.termID}
                  card={card}
                  currentClass={props.currentClass}
                  permissionLevel={props.permissionLevel}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}
                />
              )
            })}
          </tbody>
        </Table>
        }
        </div>
      )
    }
    else if (props.type === 2) {
      return (
        <div>
        {props.cards.length === 0 ? 
          <Alert> There are currently no questions in this module. </Alert>
        : 
        <Table hover className="tableList">
          <thead>
            <tr>
              <th style={{width: '64%'}}>Question</th>
              <th style={{width: '9%'}}>Picture</th>
              <th style={{width: '9%'}}>Audio</th>
              {props.permissionLevel !== "st" ? <th style={{width: '9%'}}> </th> : null}
            </tr>
          </thead>
          <tbody>    
            {props.cards.map((card) => {
              return(
                <Question
                  key={card.questionID}
                  question={card}
                  currentClass={props.currentClass}
                  permissionLevel={props.permissionLevel}
                  serviceIP={props.serviceIP}
                  curModule={props.curModule}
                  updateCurrentModule={props.updateCurrentModule}
                  allAnswers={props.allAnswers}
                  deleteTag={props.deleteTag}
                  addTag={props.addTag}
                  allTags={props.allTags}
                />
              )
            })}
          </tbody>

        </Table>
        }
        </div>
      )
    }
    else if (props.type === 3) {
      return (
        <div>
        {props.mentorQuestions.length === 0 ? 
          <Alert> There are currently no mentor questions in this module. </Alert>
        : 
        <div>
          <br/>
          <Form onSubmit={e => updateMentorFrequency(e, props.curModule, props.updateCurrentModule, props.serviceIP)}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="frequency" className="mr-sm-2"><b>Mentor Question Frequency (Every X cards):</b></Label>
              <Input type="number" name="frequency" id="frequency" value={freq} onChange={e => setFreq(e.target.value)} />
            </FormGroup>
            <br/>
            <Button>Submit</Button>
          </Form>
          <br/>
          <Table hover className="tableList">
            <thead>
              <tr>
                <th style={{width: '64%'}}>Question</th>
                {props.permissionLevel !== "st" ? <th style={{width: '9%'}}> </th> : null}
              </tr>
            </thead>
            <tbody>    
              {props.mentorQuestions.map((question) => {
                return(
                  <MentorQuestion
                    key={question.questionID}
                    question={question}
                    permissionLevel={props.permissionLevel}
                    serviceIP={props.serviceIP}
                    curModule={props.curModule}
                    updateCurrentModule={props.updateCurrentModule}
                  />
                )
              })}
            </tbody>

          </Table>
        </div>
        }
        </div>
      )
    }
}

export default CardList
