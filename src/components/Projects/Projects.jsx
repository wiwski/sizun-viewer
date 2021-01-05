import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import Tilt from 'react-tilt';
import { Container, Row, Col } from 'react-bootstrap';
import Title from '../Title/Title';

const Projects = ({ advertisments }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    <section id="projects">
      <Container>
        <div className="project-wrapper">
          <Title title="Projects" />
          {advertisments &&
            advertisments.map((ad) => {
              const {
                name,
                description,
                price,
                url,
                pictureUrl,
                id,
                houseArea,
                gardenArea,
                source,
                localization,
              } = ad;

              return (
                <Row key={id}>
                  <Col lg={4} sm={12}>
                    <Fade
                      left={isDesktop}
                      bottom={isMobile}
                      duration={1000}
                      delay={500}
                      distance="30px"
                    >
                      <div className="project-wrapper__text">
                        <h3 className="project-wrapper__text-title">{name || 'Project Title'}</h3>
                        <div>
                          <p>
                            {description ||
                              'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi neque, ipsa animi maiores repellendu distinctioaperiam earum dolor voluptatum consequatur blanditiis inventore debitis fuga numquam voluptate architecto itaque molestiae.'}
                          </p>
                          <p className="mb-4">{price || ''} €</p>
                          <p className="mb-4">{localization || ''}</p>
                          {houseArea && (
                            <p className="mb-4">Surface maison : {houseArea || ''} m²</p>
                          )}

                          {
                            <p className="mb-4">
                              Surface jardin : {gardenArea ? `${gardenArea} m²` : 'N/A'}
                            </p>
                          }

                          <p className="mb-4">{source || ''}</p>
                        </div>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-btn cta-btn--hero"
                          href={url || '#!'}
                        >
                          Voir l&apos;annonce
                        </a>
                      </div>
                    </Fade>
                  </Col>
                  <Col lg={8} sm={12}>
                    <Fade
                      right={isDesktop}
                      bottom={isMobile}
                      duration={1000}
                      delay={1000}
                      distance="30px"
                    >
                      <div className="project-wrapper__image">
                        <a
                          href={url || '#!'}
                          target="_blank"
                          aria-label="Project Link"
                          rel="noopener noreferrer"
                        >
                          <Tilt
                            options={{
                              reverse: false,
                              max: 8,
                              perspective: 1000,
                              scale: 1,
                              speed: 300,
                              transition: true,
                              axis: null,
                              reset: true,
                              easing: 'cubic-bezier(.03,.98,.52,.99)',
                            }}
                          >
                            <div data-tilt className="thumbnail rounded">
                              <img alt={name} src={pictureUrl} />
                            </div>
                          </Tilt>
                        </a>
                      </div>
                    </Fade>
                  </Col>
                </Row>
              );
            })}
        </div>
      </Container>
    </section>
  );
};

Projects.propTypes = {
  advertisments: PropTypes.arrayOf(
    PropTypes.shape({
      created: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
      gardenArea: PropTypes.number,
      houseArea: PropTypes.number,
      id: PropTypes.number,
      localization: PropTypes.string,
      name: PropTypes.string,
      pictureUrl: PropTypes.string,
      price: PropTypes.number,
      ref: PropTypes.string,
      source: PropTypes.string,
      type: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default Projects;
