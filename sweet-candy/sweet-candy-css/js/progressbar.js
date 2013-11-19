jQuery.fn.anim_progressbar = function (aOptions) {
    // def values
    var iSms = 1000;
    var iMms = 60 * iSms;
    var iHms = 3600 * iSms;
    var iDms = 24 * 3600 * iSms;

    // def options
    var aDefOpts = {
        totaltime: 65,
        start: new Date(), // now
        finish: new Date().setTime(new Date().getTime() + 65 * iSms), // now + 60 sec
        interval: 100

    }
    var aOpts = jQuery.extend(aDefOpts, aOptions);
    aOpts.finish = new Date().setTime(new Date().getTime() + aOpts.totaltime * iSms);
    var vPb = this;

    // each progress bar
    return this.each(
        function() {
            var iDuration = aOpts.finish - aOpts.start;

            // calling original progressbar
            $(vPb).children('.pbar').progressbar();

            // looping process
            var vInterval = setInterval(
                function(){
                    var iLeftMs = aOpts.finish - new Date() + 1000; // left time in MS
                    var iElapsedMs = new Date() - aOpts.start, // elapsed time in MS
                        iDays = parseInt(iLeftMs / iDms), // remained days
                        iHours = parseInt((iLeftMs - (iDays * iDms)) / iHms), // remained hours
                        iMin = parseInt((iLeftMs - (iDays * iDms) - (iHours * iHms)) / iMms), // remained minutes
                        iSec = parseInt((iLeftMs - (iDays * iDms) - (iMin * iMms) - (iHours * iHms)) / iSms), // remained seconds

                        eDays = parseInt(iElapsedMs / iDms), // elapsed days
                        eHours = parseInt((iElapsedMs - (eDays * iDms)) / iHms), // elapsed hours
                        eMin = parseInt((iElapsedMs - (eDays * iDms) - (eHours * iHms)) / iMms), // elapsed minutes
                        eSec = parseInt((iElapsedMs - (eDays * iDms) - (eMin * iMms) - (eHours * iHms)) / iSms), // elapsed seconds

                        iPerc = (iElapsedMs > 0) ? iElapsedMs / iDuration * 100 : 0; // percentages


                        if(iMin<10){iMin='0'+iMin}
                        if(iSec<10){iSec='0'+iSec}
                        if(eMin<10){eMin='0'+eMin}
                        if(eSec<10){eSec='0'+eSec}


                    // display current positions and progress
                    $(vPb).children('.percent').html('<b>'+iPerc.toFixed(1)+'%</b>');
                    if(iHours==0){
                        $(vPb).children('.elapsed').html(iMin+':'+iSec);
                    }
                    else
                    {
                        $(vPb).children('.elapsed').html(iHours+':'+iMin+':'+iSec);
                    }
                    if(eHours==0){
                        $(vPb).children('.remained').html(eMin+':'+eSec);
                    }
                    else
                    {
                        $(vPb).children('.remained').html(eHours+':'+eMin+':'+eSec);
                    }
                    if (iPerc >= 100) {iPerc = 100}
                    $(vPb).children('.pbar').children('.ui-progressbar-value').css('width', iPerc+'%');


                    // in case of Finish
                    if (iPerc >= 100) {
                        clearInterval(vInterval);
                        $(vPb).children('.percent').html('<b>100%</b>');
                        $(vPb).children('.elapsed').html('00:00');
                    }
                } ,aOpts.interval
            );
        }
    );
}