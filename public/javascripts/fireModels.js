/* ################################## */
/* ###  FIRE RATE ALGORITHMS HERE ### */
/* ################################## */

/* #### ALGORITHMS FOR CONTINOUS GRASSLAND #### */

// McArthur Grassland Fire Danger Index Mk3/4
// todo: add detailed comment
function MK34_GFDI(C,T,RH,U) {
    return (2*Math.exp((-23.6)+(5.1*Math.log(C))+(0.0281*T)-(0.226*Math.sqrt(RH))+(0.663*Math.sqrt(U))));
}

// McArthur headfire rate of spread
// todo: add detailed comment
function MK34_rate(GFDI) { return (0.13*GFDI); }

// Mcarthur Grassland Fire Danger Index Mk5
// takes into account fuel load
function MK5_GFDI(w,C,T,RH,U) {
    // compute moisture content (MC)
    var MC = (((97.7+(4.06*RH))/(T+6))-(0.00854*RH)+(3000/C)-30);
    // compute GFDI depending on MC
    if(MC<18.8) {
        return ((3.35*w)*(exp((-0.0897*MC))+(0.0403*U)));
    } else if(MC>=18.8) {
        return ((0.299*w)*(exp((-1.686*MC))+(0.0403*U))*(30-MC));
    } else {
        // error has occurred
    }
}

// McArthur headfire rate of spread Mk5
// Takes into account fuel load
function MK5_rate(GFDI, w) {
    if((w>=4)&&(w<=6)) {
        // MK5 uses 0.14 to account for differences in observed values from different meters
        return (0.14*GFDI); 
    } else if((w>=0)&&(w<4)) {
        return (0.06*GFDI);
    } else {
        // error has occurred
    }
}