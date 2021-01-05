import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { Container, Row, Col } from 'react-bootstrap';
import Title from '../Title/Title';

const subscriptionUrl = '/.netlify/functions/push-subscription';

const saveSubscriptionToServer = async (subscription) => {
  const body = JSON.stringify({
    endpoint: subscription.endpoint,
    data: JSON.stringify(subscription),
  });
  try {
    const saveResponse = await fetch(subscriptionUrl, {
      method: 'POST',
      body,
    });
    if (saveResponse.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const hasNotificationPermission = async () => {
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    }
  }
  return false;
};

const pushSupported = () => {
  if (typeof window !== `undefined`) {
    if ('PushManager' in window) {
      return true;
    }
  }
  return false;
};

const About = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [, setWorking] = useState(false);

  const createSubscription = async () => {
    const hasPermission = await hasNotificationPermission();
    if (pushSupported() && 'serviceWorker' in navigator && hasPermission) {
      const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; i += 1) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };
      setWorking(true);
      navigator.serviceWorker.ready
        .then(async (swRegistration) => {
          const pushSubscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAETtzJDtKpee4AMn2WsWXnIaJ5aUoQ15pSE1NapqQWEPBaRf6Oj_HG81BXC26e3t3mLzWCnBloeSGxCuw_kPuQZQ=='
            ),
          });
          const subSaved = await saveSubscriptionToServer(pushSubscription);
          if (subSaved) {
            console.log('Push subscription confirmed', 'success');
          } else {
            console.log('An eror occured', 'error');
          }
        })
        .catch((error) => {
          console.error('An error occured setting up push notification', 'warning');
          console.error(error);
        });
    } else {
      console.error('Notifications not allowed.', 'error');
    }
    setWorking(false);
  };

  useEffect(() => {
    if (pushSupported() && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((swRegistration) => swRegistration.update());
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
  }, []);

  return (
    <section id="about">
      <Container>
        <Title title="Être notifié des dernières annonces" />
        <Row className="about-wrapper">
          <Col md={6} sm={12}>
            <Fade left={isDesktop} bottom={isMobile} duration={1000} delay={1000} distance="30px">
              <div className="about-wrapper__info">
                <span className="d-flex 5">
                  <button
                    type="button"
                    className="cta-btn cta-btn--resume"
                    style={{ fontSize: '1.6rem', backgroundColor: 'transparent' }}
                    onClick={createSubscription}
                  >
                    Activer les notifications
                  </button>
                </span>
              </div>
            </Fade>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
