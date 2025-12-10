import React, {useEffect, useRef, useState} from "react";
import {Carousel as CarouselModel, Item} from "../../typescript"
import {Button, Card, Carousel as CarouselAnt, Col, Row, Skeleton} from "antd";

import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

import './Carousel.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IFormular, IFormularCreator} from "../../classes";
import {getConfigValue} from "../../helpers";

library.add(far);
library.add(fas);

type ChunkedArrayType = Item[][];

const CustomHeader = ({ fieldsArray, label, chunkSize, carousel }) => {

    const isDisabled = fieldsArray.length < chunkSize + 1;

    return (
        <Row justify="space-between" align="middle" style={{ background: '#fff', padding: '0 12px' }}>
            <Col>
                <span style={{ fontSize: '20px', fontWeight: 600 }}>{label}</span>
            </Col>
            <Col>
                <Button.Group size={'small'}>
                    <Button disabled={isDisabled} icon={<FontAwesomeIcon icon={faChevronLeft} />} onClick={() => carousel.tsxGoPrev()} />
                    <Button disabled={isDisabled} icon={<FontAwesomeIcon icon={faChevronRight} />} onClick={() => carousel.tsxGoNext()} />
                </Button.Group>
            </Col>
        </Row>
    );
};

const CustomButtonCard = ({ icon, text, subtext, model, item, onClick }) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="custom-button-card"
            style={
                isHovered
                    ? { backgroundColor: model._style.backgroundColor, borderColor: model._style.color, color: model._style.color }
                    : { backgroundColor: model._style.backgroundColor }
            }
        >
            <Row style={{ width: '100%' }} justify={'center'} align={'top'}>
                <Row justify={'end'} style={{ width: '100%', padding: '12px 12px 0 8px', borderRadius: 8 }}>
                    <FontAwesomeIcon color={model._style.color} icon={icon} style={{ fontSize: 18 }} />
                    {/* <Skeleton active={isHovered} paragraph={{ rows: 2 }} /> */}
                </Row>
            </Row>
            <Row>
                <div className="custom-card-content" style={{ padding: 8 }}>
                    { model._labels?.map((labelFunction: (item: Item) => string, index: number) => {
                        return (
                            <div className="custom-card-subtext">{labelFunction(item)}</div>
                        )
                    })}
                </div>
            </Row>
            <Row>
                <div className="custom-card-content" style={{ padding: 8 }}>
                    <div className="custom-card-text">{text}</div>
                    <div className="custom-card-subtext">{subtext}</div>
                </div>
            </Row>
        </Button>
    );
};

const Carousel = (props: any) =>
{
    let model: CarouselModel = props.model;
    let fields: Item[] = model._fields;

    const carouselRef = useRef(null);

    let contentStyle: React.CSSProperties = {
        color: '#ffffff',
        background: '#ffffff',
        borderRadius: '8px',
        margin: '4px',
        padding: fields.length <= 3 ? '4px 4px 4px 4px' : '4px 4px 16px 4px',
        outline: 'none'
    };

    contentStyle = { ...contentStyle };

    const chunkArray = (array: Item[], chunkSize: number): ChunkedArrayType => {
        const tempArray: ChunkedArrayType = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            tempArray.push(array.slice(i, i + chunkSize));
        }
        return tempArray;
    };

    const [chunkedArray, setChunkedArray] = useState<ChunkedArrayType>(chunkArray(fields, 5)); // Explicitly setting the type of state

    // State for chunk size
    const [chunkSize, setChunkSize] = useState(5); // default chunk size

    // Function to calculate chunk size based on window width
    const calculateChunkSize = () => {
        const width = window.innerWidth;
        if (width < 800) return 1; // for small screens
        else if (width < 1000) return 2; // for medium screens
        else if (width < 1400) return 4; // for medium screens
        else return 6; // for large screens
    };

    // UseEffect to set and update chunk size on window resize
    useEffect(() => {
        const handleResize = () => {
            setChunkSize(calculateChunkSize());
        };

        // Set initial size
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update chunkedArray when chunkSize or fields change
    useEffect(() => {
        setChunkedArray(chunkArray(fields, chunkSize));
    }, [fields, chunkSize]);

    model.tsxGoNext = () => {
        // @ts-ignore
        carouselRef.current?.next();
    };

    model.tsxGoPrev = () => {
        // @ts-ignore
        carouselRef.current?.prev();
    };

    return (
        <>
            <CustomHeader fieldsArray={fields} label={model._label} chunkSize={chunkSize} carousel={model}></CustomHeader>
            <CarouselAnt ref={carouselRef}
                    draggable
                    adaptiveHeight
                    afterChange={() => {}}
            >
            {chunkedArray.map((chunk, index) => (
                <div key={index} tabIndex={-1}>
                    <Row style={contentStyle} tabIndex={-1}>
                        {chunk.map((item: Item, chunkIndex: number) => {
                            let icon = model._getIcon(item)
                            let name = model._getName(item)
                            let description = model._getDescription(item)
                            console.log(icon, name, description, item)
                            return (
                                <Col key={`${index}-${chunkIndex}`} span={(24/chunkSize)} style={{ padding: '4 4 8 4' }}>
                                <CustomButtonCard
                                    icon={icon ? ['fas', icon] : ['fas', 'file']}
                                    text={name}
                                    subtext={description}
                                    model={model}
                                    item={item}
                                    onClick={() => item._callback()}
                                />
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            ))}
            </CarouselAnt>
        </>

    )
};

export default Carousel;