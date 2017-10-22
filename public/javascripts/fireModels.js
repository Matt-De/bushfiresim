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
        return ((3.35*w)*(Math.exp((-0.0897*MC))+(0.0403*U)));
    } else {
        return ((0.299*w)*(Math.exp((-1.686*MC))+(0.0403*U))*(30-MC));
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

// CSIRO Grassland fire spread model
// for undisturbed grass
function CSIRO_rate_undisturbed(U, phiM, phiC) {
    if(U<5) {
        return (0.054 + 0269*U)*phiM*phiC;
    } else {
        return (1.4 + 0.838*((U-5)^0.844))*phiM*phiC
    }
}

// for cut grass
function CSIRO_rate_cut(U, phiM, phiC) {
    if(U<5) {
        return (0.054 + 0209*U)*phiM*phiC;
    } else {
        return (1.1 + 0.715*(U-5)^0.844)*phiM*phiC
    }
}

// computes phiM using the wind speed and moisture content
function CSIRO_phiM(MC, U) {
    if(MC<12) {
        return Math.exp(-0.108*MC);
    } else if((MC>12) && (U<=10)) {
        return (0.684 - 0.0342*MC);
    } else {
        return (0.547 - 0.0228*MC);
    }
}

// computes the moisture content using temperature and humidity
function CSIRO_MC(T, RH) {
    return (9.58 - 0.205*T + 0.138*RH);
}

// computes phiC using the curing level
function CSIRO_phiC(C) {
    return ((1.12)/(1+59.2*Math.exp(-0.124*(C-50))));
}
