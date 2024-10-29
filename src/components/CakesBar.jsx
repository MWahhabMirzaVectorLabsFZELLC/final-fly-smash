import React from "react";
import cake1 from '../assets/cake1.png';
import cake2 from '../assets/cake2.png';
import cake3 from '../assets/cake3.png';
import cake4 from '../assets/cake4.png';
import cake5 from '../assets/cake5.png';
import cake6 from '../assets/cake6.png';
const CakesBar = () => {
    return (
        <div className="cakes-bar">
            <img src={cake1} className="cakes-bar-image" alt="cake1" />
            <img src={cake2} className="cakes-bar-image" alt="cake2" />
            <img src={cake3} className="cakes-bar-image" alt="cake3" />
            <img src={cake4} className="cakes-bar-image" alt="cake4" />
            <img src={cake5} className="cakes-bar-image" alt="cake5" />
            <img src={cake6} className="cakes-bar-image" alt="cake6" />

        </div>
    )
}
export default CakesBar;