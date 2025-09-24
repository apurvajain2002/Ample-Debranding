import { ClockLoader as Spinner } from 'react-spinners';
import { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context';

const CustomClockLoader = ({size}) => {
    const { rootColor } = useGlobalContext();
    return (
        <div className="overlay_clock">
            <div className="overlay__inner_clock">
                <div className="overlay__content_clock">
                    <Spinner color={rootColor.primary} loading={true} size={size}/>
                </div>
            </div>
        </div>
    );
};

export default CustomClockLoader;