import React, { useEffect, useState } from "react";
import client, {
  databases,
  databaseId,
  collectionId,
} from "../../appwrite/appwriteConfig";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.decuments`,
      (response) => {
        if (
          response.events.include("databases.*.collections.*.document.*.create")
        ) {
          console.log("A message was created");
          // setMessages((prevState) => [response.payload, ...messages]);
        }
        if (
          response.events.include("databases.*.collections.*.document.*.delete")
        ) {
          console.log("A message was delete!!");
          // setMessages((prevState) =>
          //   messages.filter((messages) => messages.$id !== response.payload.$id)
          // );
        }
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      body: messageBody,
    };

    let response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      payload
    );
    console.log(`created: ${response}`);
    setMessageBody("");
    setMessages((prevState) => [response, ...prevState]);
  };

  const getMessages = async () => {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(6),
    ]);
    console.log("Response: ", response);
    setMessages(response.documents);
  };

  const deleteMessage = async (messages_id) => {
    databases.deleteDocument(databaseId, collectionId, messages_id);
    setMessages((prevState) =>
      messages.filter((messages) => messages.$id !== messages_id)
    );
  };

  return (
    <main className="container ">
      <div className="room--container">
        <form onSubmit={handleSubmit} action="" id="message--form">
          <div>
            <textarea
              required
              maxLength={1200}
              placeholder="your message"
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="send" />
          </div>
        </form>

        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <small className="message-timestamp">
                  {new Date(message.$createdAt).toLocaleString()}
                </small>
                <Trash2
                  className="delete--btn"
                  onClick={() => {
                    deleteMessage(message.$id);
                  }}
                />
              </div>
              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
