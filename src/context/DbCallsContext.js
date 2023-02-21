import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

export const getUserEvents = (user, db, setIsLoading, setUserEvents) => {
  try {
    if (user !== null) {
      if (Object.keys(user).length !== 0) {
        const usersRef = collection(db, "users", user.uid, "events");
        onSnapshot(usersRef, async (snap) => {
          // console.log("changes",snap.docChanges());
          // const data = await getDocs(
          //   query(
          //     usersRef,
          //     orderBy("start_date"),
          //     orderBy("start_time"),
          //     orderBy("end_date"),
          //     orderBy("end_time")
          //   )
          // );

          if (snap.docChanges().length === 0) {
            setIsLoading(false);
          }

          setUserEvents(
            snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUserEventsDetails = (
  db,
  userEvents,
  userEventsDetails,
  adminEventsDetails,
  setUserEventsDetails,
  setAdminEventsDetails
) => {
  const userEventsArr = Array.from(userEvents);
  let userEv = [];
  let adminEv = [];
  //   console.log("ud ", userEventsDetails)
  userEventsArr.map(async (event) => {
    // console.log("event ", event)
    // console.log("ued ", userEventsDetails )
    const foundGuest = userEventsDetails.find((ev) => ev["id"] !== event.id);
    const foundAdmin = adminEventsDetails.find((ev) => ev["id"] !== event.id);
    if (!foundGuest && !foundAdmin) {
      let eventObj = new Object();
      let activities = [];
      let users = new Set();
      const eventRef = doc(db, "events", event.id, "data", "event_details");
      const eventUsersRef = collection(db, "events", event.id, "users");
      const activitiesRef = collection(db, "events", event.id, "activities");
      const usersDocs = await getDocs(eventUsersRef);
      const eventDetailsDoc = await getDoc(eventRef);
      const activitiesDocs = await getDocs(
        query(
          activitiesRef,
          orderBy("start_date"),
          orderBy("start_time"),
          orderBy("end_date"),
          orderBy("end_time")
        )
      ).then(async (activitiesDocs) => {
        eventObj["activities"] = {};

        activitiesDocs.docs.map((activity) => {
          let act = new Object(activity.data());
          act["id"] = activity.id;
          activities.push(act);
        });

        usersDocs.docs.map((user) => {
          let us = new Object();
          us["id"] = user.id.toString().trim();
          us["status"] = user.data()["status"];
          users.add(us);
        });

        eventObj["details"] = eventDetailsDoc.data();
        eventObj["users"] = users;
        eventObj["activities"] = activities;
        eventObj["id"] = event.id;

        if (event.status === "guest") {
          userEv.push(eventObj);
          setUserEventsDetails(userEv);
          //   console.log("user obj before ", userEv);

          //   console.log("user obj after ", userEv);
        } else {
          // setAdminEventsDetails((eventDetails) => [...eventDetails, eventObj]);
          adminEv.push(eventObj);
          setAdminEventsDetails(adminEv);
        }
      });
    }
  });
};

export const getEvents = (db, setIsLoading, setEvents) => {
  try {
    const eventsRef = collection(db, "events");
    onSnapshot(eventsRef, async () => {
      //   const data = await getDocs(
      //     query(
      //       eventsRef,
      //       orderBy("start_date"),
      //       orderBy("start_time"),
      //       orderBy("end_date"),
      //       orderBy("end_time")
      //     )
      //   );
      const data = await getDocs(eventsRef);
      if (data.docChanges().length === 0) {
        setIsLoading(false);
      }

      setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  } catch (e) {
    console.log(e);
  }
};

export const getEventsDetails = (
  db,
  events,
  eventsDetails,
  setEventsDetails
) => {
  const userEventsArr = Array.from(events);
  userEventsArr.map(async (event) => {
    const found = eventsDetails.find((ev) => ev["id"] !== event.id);
    if (!found) {
      let eventObj = new Object();
      let activities = [];
      let users = new Set();
      const eventRef = doc(db, "events", event.id, "data", "event_details");
      const eventUsersRef = collection(db, "events", event.id, "users");
      const activitiesRef = collection(db, "events", event.id, "activities");
      const usersDocs = await getDocs(eventUsersRef);
      const eventDetailsDoc = await getDoc(eventRef);
      const activitiesDocs = await getDocs(
        query(
          activitiesRef,
          orderBy("start_date"),
          orderBy("start_time"),
          orderBy("end_date"),
          orderBy("end_time")
        )
      );
      eventObj["activities"] = {};

      activitiesDocs.docs.map((activity) => {
        let act = new Object(activity.data());
        act["id"] = activity.id;
        activities.push(act);
      });

      usersDocs.docs.map((user) => {
        let us = new Object();
        us["id"] = user.id.toString().trim();
        us["status"] = user.data()["status"];
        users.add(us);
      });

      eventObj["details"] = eventDetailsDoc.data();
      eventObj["users"] = users;
      eventObj["activities"] = activities;
      eventObj["id"] = event.id;

      setEventsDetails((eventDetails) => [...eventDetails, eventObj]);
    }
  });
};

export const handleFollow = async (
  db,
  eventID,
  userID,
  start_date,
  start_time,
  end_date,
  end_time,
  setIsFollowing
) => {
  const userRef = doc(db, "users", userID, "events", eventID);
  const eventRef = doc(db, "events", eventID, "users", userID);

  await setDoc(eventRef, { status: "guest" });
  await setDoc(userRef, {
    status: "guest",
    start_date: start_date,
    start_time: start_time,
    end_date: end_date,
    end_time: end_time,
  });
};

export const handleUnfollow = async (db, eventID, userID, setIsFollowing) => {
  const userRef = doc(db, "users", userID, "events", eventID);
  const eventRef = doc(db, "events", eventID, "users", userID);
  await deleteDoc(userRef);
  await deleteDoc(eventRef);

  //   setIsFollowing(false);
};

export const handleDelete = async (db, userID, eventID) => {
  const eventUserRef = doc(db, "users", userID, "events", eventID);
  await deleteDoc(eventUserRef);
  console.log("doc ", eventID, " deleted");
};
