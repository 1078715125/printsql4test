/**
* @version: 2.1.17 
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2015 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://www.improvely.com/
*/

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['moment', 'jquery', 'exports'], function(momentjs, $, exports) {
      root.datepopover = factory(root, exports, momentjs, $);
    });

  } else if (typeof exports !== 'undefined') {
      var momentjs = require('moment');
      var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;  //isomorphic issue
      if (!jQuery) {
          try {
              jQuery = require('jquery');
              if (!jQuery.fn) jQuery.fn = {}; //isomorphic issue
          } catch (err) {
              if (!jQuery) throw new Error('jQuery dependency not found');
          }
      }

    factory(root, exports, momentjs, jQuery);

  // Finally, as a browser global.
  } else {
    root.datepopover = factory(root, {}, root.moment || moment, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this || {}, function(root, datepopover, moment, $) { // 'this' doesn't exist on a server

    var datepopover = function(element, options, cb) {

        //default settings for options
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        
        this.temp_dates = [];//wei.li modify
        this.click_temp = false // wei.li modify 控制点击后才缓存数据
        this.isShow = false;
        this.minDate = false;
        this.maxDate = false;
        this.dateLimit = false;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.ranges = {};
        this.mulitDates = false;//wei.li modify 支持多选时间段
        this.capacity = {};
        this.opens = 'right';
        if (this.element.hasClass('pull-right'))
            this.opens = 'left';

        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';

        this.buttonClasses = 'btn btn-sm';
        this.applyClass = 'btn-success';
        this.cancelClass = 'btn-default';

        this.locale = {
            format: 'YYYYMMDD',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };

        this.callback = function() { };

        //some state information
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};

        //custom options from user
        if (typeof options !== 'object' || options === null)
            options = {};

        //allow setting options with data attributes
        //data-api options will be overwritten with custom javascript options
        options = $.extend(this.element.data(), options);

        //html template for the picker UI
        if (typeof options.template !== 'string')
        	//modify  by duanweidong 
        	//加入calID,区分三个不同的calendar 
            options.template = '<div id="'+options.calId+'" class="datepopover dropdown"  >' +
//            	'<div class="row">' +
                '<div class="calendar left col-md-5" style="margin-left:25px;width:45%;">' +
//                    '<div class="datepopover_input">' +
//                      '<input class="input-mini" type="text" name="datepopover_start" value="" />' +
//                      '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
//                      '<div class="calendar-time">' +
//                        '<div></div>' +
//                        '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
//                      '</div>' +
//                    '</div>' +
                    '<div class="calendar-table"  ></div>' +
                '</div>' +
                '<div class="calendar right col-md-5" style="margin-left:50px;width:45%">' +
//                    '<div class="datepopover_input">' +
//                      '<input class="input-mini" type="text" name="datepopover_end" value="" />' +
//                      '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
//                      '<div class="calendar-time">' +
//                        '<div></div>' +
//                        '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
//                      '</div>' +
//                    '</div>' +
                    '<div class="calendar-table" ></div>' +
                '</div>' +
                '<div class="ranges col-md-2" style="margin-right:0px">' +
//                	 '<div class="">' +
//                     '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
//                        '<button class="cancelBtn" type="button"></button>' +
//                    '</div>' +
                '</div>'+
                '</div>' +
           	'<div class="row">' +
           	'<div class="col-md-4"></div>' +
//              '<div  name="temp_dates" class="row  col-md-12" style="height:100px;width:400px;overflow:scroll"  />' +
//                	'<div class="">' +
//                   
//                	'</div>' +
//             	'</div>'+
         		'</div>'+
			'</div>'
        this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(options.template).appendTo(this.parentEl);
  
        //
        // handle all the possible options overriding defaults
        //

        if (typeof options.locale === 'object') {

            if (typeof options.locale.format === 'string')
                this.locale.format = options.locale.format;

            if (typeof options.locale.separator === 'string')
                this.locale.separator = options.locale.separator;

            if (typeof options.locale.daysOfWeek === 'object')
                this.locale.daysOfWeek = options.locale.daysOfWeek.slice();

            if (typeof options.locale.monthNames === 'object')
              this.locale.monthNames = options.locale.monthNames.slice();

            if (typeof options.locale.firstDay === 'number')
              this.locale.firstDay = options.locale.firstDay;

            if (typeof options.locale.applyLabel === 'string')
              this.locale.applyLabel = options.locale.applyLabel;

            if (typeof options.locale.cancelLabel === 'string')
              this.locale.cancelLabel = options.locale.cancelLabel;

            if (typeof options.locale.weekLabel === 'string')
              this.locale.weekLabel = options.locale.weekLabel;

            if (typeof options.locale.customRangeLabel === 'string')
              this.locale.customRangeLabel = options.locale.customRangeLabel;
              
            

        }

        if (typeof options.startDate === 'string')
            this.startDate = moment(options.startDate, this.locale.format);

        if (typeof options.endDate === 'string')
            this.endDate = moment(options.endDate, this.locale.format);

        if (typeof options.minDate === 'string')
            this.minDate = moment(options.minDate, this.locale.format);

        if (typeof options.maxDate === 'string')
            this.maxDate = moment(options.maxDate, this.locale.format);

        if (typeof options.startDate === 'object')
            this.startDate = moment(options.startDate);

        if (typeof options.endDate === 'object')
            this.endDate = moment(options.endDate);

        if (typeof options.minDate === 'object')
            this.minDate = moment(options.minDate);

        if (typeof options.maxDate === 'object')
            this.maxDate = moment(options.maxDate);

        // sanity check for bad options
        if (this.minDate && this.startDate.isBefore(this.minDate))
            this.startDate = this.minDate.clone();

        // sanity check for bad options
        if (this.maxDate && this.endDate.isAfter(this.maxDate))
            this.endDate = this.maxDate.clone();

        if (typeof options.applyClass === 'string')
            this.applyClass = options.applyClass;

        if (typeof options.cancelClass === 'string')
            this.cancelClass = options.cancelClass;

        if (typeof options.dateLimit === 'object')
            this.dateLimit = options.dateLimit;

        if (typeof options.opens === 'string')
            this.opens = options.opens;

        if (typeof options.drops === 'string')
            this.drops = options.drops;

        if (typeof options.showWeekNumbers === 'boolean')
            this.showWeekNumbers = options.showWeekNumbers;

        if (typeof options.buttonClasses === 'string')
            this.buttonClasses = options.buttonClasses;

        if (typeof options.buttonClasses === 'object')
            this.buttonClasses = options.buttonClasses.join(' ');

        if (typeof options.showDropdowns === 'boolean')
            this.showDropdowns = options.showDropdowns;

        if (typeof options.singleDatePicker === 'boolean') {
            this.singleDatePicker = options.singleDatePicker;
            if (this.singleDatePicker)
                this.endDate = this.startDate.clone();
        }

        if (typeof options.timePicker === 'boolean')
            this.timePicker = options.timePicker;

        if (typeof options.timePickerSeconds === 'boolean')
            this.timePickerSeconds = options.timePickerSeconds;

        if (typeof options.timePickerIncrement === 'number')
            this.timePickerIncrement = options.timePickerIncrement;

        if (typeof options.timePicker24Hour === 'boolean')
            this.timePicker24Hour = options.timePicker24Hour;

        if (typeof options.autoApply === 'boolean')
            this.autoApply = options.autoApply;

        if (typeof options.autoUpdateInput === 'boolean')
            this.autoUpdateInput = options.autoUpdateInput;

        if (typeof options.linkedCalendars === 'boolean')
            this.linkedCalendars = options.linkedCalendars;

        if (typeof options.isInvalidDate === 'function')
            this.isInvalidDate = options.isInvalidDate;
            
            
        if (typeof options.isShow === 'boolean')
            this.isShow = options.isShow;
        //wei.li modify
        if (typeof options.mulitDates === 'boolean')
            this.mulitDates = options.mulitDates;

       if (typeof options.capacity === 'object')
        	this.capacity = options.capacity;
       //duanweidong modify
       if(typeof options.detailCapacity == 'object'){
    	   this.detailCapacity = options.detailCapacity;
       }
       //duanweidong modify
       if(typeof options.calId == 'string'){
    	   this.calId = options.calId;
       }
        // update day names order to firstDay
        if (this.locale.firstDay != 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }

        var start, end, range;

        //if no start/end dates set, check if an input element contains initial values
        if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
            if ($(this.element).is('input[type=text]')) {
                var val = $(this.element).val(),
                    split = val.split(this.locale.separator);

                start = end = null;

                if (split.length == 2) {
                    start = moment(split[0], this.locale.format);
                    end = moment(split[1], this.locale.format);
                } else if (this.singleDatePicker && val !== "") {
                    start = moment(val, this.locale.format);
                    end = moment(val, this.locale.format);
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end);
                }
            }
        }

        if (typeof options.ranges === 'object') {
            for (range in options.ranges) {

                if (typeof options.ranges[range][0] === 'string')
                    start = moment(options.ranges[range][0], this.locale.format);
                else
                    start = moment(options.ranges[range][0]);

                if (typeof options.ranges[range][1] === 'string')
                    end = moment(options.ranges[range][1], this.locale.format);
                else
                    end = moment(options.ranges[range][1]);
    			
                // If the start or end date exceed those allowed by the minDate or dateLimit
                // options, shorten the range to the allowable period.
                if (this.minDate && start.isBefore(this.minDate))
                    start = this.minDate.clone();

                var maxDate = this.maxDate;
                if (this.dateLimit && start.clone().add(this.dateLimit).isAfter(maxDate))
                    maxDate = start.clone().add(this.dateLimit);
                if (maxDate && end.isAfter(maxDate))
                    end = maxDate.clone();

                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((this.minDate && end.isBefore(this.minDate)) || (maxDate && start.isAfter(maxDate)))
                    continue;
                
                //Support unicode chars in the range names.
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end];
            }
			
            var list = '<ul>';
            for (range in this.ranges) {
                list += '<li>' + range + '</li>';
            }
            list += '<li>' + this.locale.customRangeLabel + '</li>';
            list += '</ul>';
            this.container.find('.ranges').prepend(list);
        }

        if (typeof cb === 'function') {
            this.callback = cb;
        }

        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
            this.container.find('.calendar-time').hide();
        }

        //can't be used together for now
        if (this.timePicker && this.autoApply)
            this.autoApply = false;

        if (this.autoApply && typeof options.ranges !== 'object') {
            this.container.find('.ranges').hide();
        } else if (this.autoApply) {
            this.container.find('.applyBtn, .cancelBtn').addClass('hide');
        }

        if (this.singleDatePicker) {
            this.container.addClass('single');
            this.container.find('.calendar.left').addClass('single');
            this.container.find('.calendar.left').show();
            this.container.find('.calendar.right').hide();
            this.container.find('.datepopover_input input, .datepopover_input i').hide();
            if (!this.timePicker) {
                this.container.find('.ranges').hide();
            }
        }

        if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
//            this.container.addClass('show-calendar');
        }

        this.container.addClass('opens' + this.opens);

        //swap the position of the predefined ranges if opens right
        if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
            var ranges = this.container.find('.ranges');
            var html = ranges.clone();
            ranges.remove();
            this.container.find('.calendar.left').parent().prepend(html);
        }

        //apply CSS classes and labels to buttons
        this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

        //
        // event listeners
        //

        this.container.find('.calendar')
//            .on('click.datepopover', '.prev', $.proxy(this.clickPrev, this))
//            .on('click.datepopover', '.next', $.proxy(this.clickNext, this))
//            .on('click.datepopover', 'td div.available', $.proxy(this.clickDate, this))
//            .on('click.datepopover', 'td div.available', $.proxy(this.createPopover, this))
//             .on('mouseenter.datepopover', 'td div.available', $.proxy(this.createPopover, this))
//            .on('mouseenter.datepopover', 'td div.available', $.proxy(this.hoverDate, this))
            .on('mouseleave.datepopover', 'td div.available', $.proxy(this.updateFormInputs, this))
            .on('change.datepopover', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.datepopover', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
            .on('change.datepopover', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this))
//            .on('click.datepopover', '.datepopover_input input', $.proxy(this.showCalendars, this))
            //.on('keyup.datepopover', '.datepopover_input input', $.proxy(this.formInputsChanged, this))
            .on('change.datepopover', '.datepopover_input input', $.proxy(this.formInputsChanged, this));

        this.container.find('.ranges')
//            .on('click.datepopover', 'button.applyBtn', $.proxy(this.clickApply, this))
//            .on('click.datepopover', 'button.cancelBtn', $.proxy(this.clickCancel, this))
//            .on('click.datepopover', 'li', $.proxy(this.clickRange, this))
//            .on('mouseenter.datepopover', 'li', $.proxy(this.hoverRange, this))
            .on('mouseleave.datepopover', 'li', $.proxy(this.updateFormInputs, this));

        if (this.element.is('div')) {
            this.element.on({
//                'click.datepopover': $.proxy(this.show, this),
                'focus.datepopover': $.proxy(this.show, this),
                'keyup.datepopover': $.proxy(this.elementChanged, this),
                'keydown.datepopover': $.proxy(this.keydown, this)
            });
            
        } else {
//            this.element.on('click.datepopover', $.proxy(this.toggle, this));
        }

        //
        // if attached to a text input, set the initial value
        //

        if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            this.element.trigger('change');
        } else if (this.element.is('input') && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format));
            this.element.trigger('change');
        }
        
    };

    datepopover.prototype = {

        constructor: datepopover,
	
        setStartDate: function(startDate) {
            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.locale.format);

            if (typeof startDate === 'object')
                this.startDate = moment(startDate);

            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');

            if (this.timePicker && this.timePickerIncrement)
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

            if (this.minDate && this.startDate.isBefore(this.minDate))
                this.startDate = this.minDate;

            if (this.maxDate && this.startDate.isAfter(this.maxDate))
                this.startDate = this.maxDate;

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        setEndDate: function(endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.locale.format);

            if (typeof endDate === 'object')
                this.endDate = moment(endDate);

            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');

            if (this.timePicker && this.timePickerIncrement)
                this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

            if (this.endDate.isBefore(this.startDate))
                this.endDate = this.startDate.clone();

            if (this.maxDate && this.endDate.isAfter(this.maxDate))
                this.endDate = this.maxDate;

            if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
                this.endDate = this.startDate.clone().add(this.dateLimit);

            this.previousRightTime = this.endDate.clone();

            if (!this.isShowing)
                this.updateElement();

            this.updateMonthsInView();
        },

        isInvalidDate: function() {
            return false;
        },
	
        updateView: function() {
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
                if (!this.endDate) {
                    this.container.find('.right .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
                } else {
                    this.container.find('.right .calendar-time select').removeAttr('disabled').removeClass('disabled');
                }
            }
            if (this.endDate) {
                this.container.find('input[name="datepopover_end"]').removeClass('active');
                this.container.find('input[name="datepopover_start"]').addClass('active');
                
                //wei.li modify
                
                if(this.mulitDates && this.click_temp){
		            var tempName = this.startDate.format(this.locale.format)+"-"+this.endDate.format(this.locale.format);
		            var checkNames = false;
		            for(i=0;i<this.temp_dates.length;i++){
		            	if(tempName == this.temp_dates[i].dispaly){
		            		checkNames = true;
		            	}
		            }
		            if(!checkNames){
		            	this.temp_dates[this.temp_dates.length] = {start:this.startDate.format(this.locale.format),end:this.endDate.format(this.locale.format),dispaly:tempName};
		            }
		       		
		             this.container.find('.temp_dates_span').click($.proxy(this.deleteT, this))
		         }
		             
            } else {
                this.container.find('input[name="datepopover_end"]').addClass('active');
                this.container.find('input[name="datepopover_start"]').removeClass('active');
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
        },

        updateMonthsInView: function() {
            if (this.endDate) {

                //if both dates are visible already, do nothing
                if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                    (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                    &&
                    (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
                    ) {
                    return;
                }

                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                } else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
                
            } else {
                if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
                    this.leftCalendar.month = this.startDate.clone().date(2);
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        },

        updateCalendars: function() {

            if (this.timePicker) {
                var hour, minute, second;
                if (this.endDate) {
                    hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                } else {
                    hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                }
                this.leftCalendar.month.hour(hour).minute(minute).second(second);
                this.rightCalendar.month.hour(hour).minute(minute).second(second);
            }

            this.renderCalendar('left');
            this.renderCalendar('right');

            //highlight any predefined range matching the current start and end dates
            this.container.find('.ranges li').removeClass('active');
            if (this.endDate == null) return;

            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                        break;
                    }
                } else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                        break;
                    }
                }
                i++;
            }
            if (customRange) {
                this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
                this.showCalendars();
            }

        },

        renderCalendar: function(side) {

            //
            // Build the matrix of dates that will populate the calendar
            //

            var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
            var month = calendar.month.month();
            var year = calendar.month.year();
            var hour = calendar.month.hour();
            var minute = calendar.month.minute();
            var second = calendar.month.second();
            var daysInMonth = moment([year, month]).daysInMonth();
            var firstDay = moment([year, month, 1]);
            var lastDay = moment([year, month, daysInMonth]);
            var lastMonth = moment(firstDay).subtract(1, 'month').month();
            var lastYear = moment(firstDay).subtract(1, 'month').year();
            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
            var dayOfWeek = firstDay.day();

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;

            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

            var col, row;
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
                curDate.hour(12);

                if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
                    calendar[row][col] = this.minDate.clone();
                }

                if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
                    calendar[row][col] = this.maxDate.clone();
                }

            }

            //make the calendar object available to hoverDate/clickDate
            if (side == 'left') {
                this.leftCalendar.calendar = calendar;
            } else {
                this.rightCalendar.calendar = calendar;
            }

            //
            // Display the calendar
            //

            var minDate = side == 'left' ? this.minDate : this.startDate;
            var maxDate = this.maxDate;
            var selected = side == 'left' ? this.startDate : this.endDate;

            var html = '<table class="table-condensed" style="width:100%;">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers)
                html += '<th></th>';

            if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
                html += '<th></th>';
//                html += '<th class="prev available"><i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml =  calendar[1][1].format(" YYYY")+ "年" +  this.locale.monthNames[calendar[1][1].month()];

            if (this.showDropdowns) {
                var currentMonth = calendar[1][1].month();
                var currentYear = calendar[1][1].year();
                var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
                var minYear = (minDate && minDate.year()) || (currentYear - 50);
                var inMinYear = currentYear == minYear;
                var inMaxYear = currentYear == maxYear;

                var monthHtml = '<select class="monthselect">';
                for (var m = 0; m < 12; m++) {
                    if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            ">" + this.locale.monthNames[m] + "</option>";
                    } else {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") +
                            " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
                    }
                }
                monthHtml += "</select>";

                var yearHtml = '<select class="yearselect">';
                for (var y = minYear; y <= maxYear; y++) {
                    yearHtml += '<option value="' + y + '"' +
                        (y === currentYear ? ' selected="selected"' : '') +
                        '>' + y + '</option>';
                }
                yearHtml += '</select>';

                dateHtml = yearHtml + "年" + monthHtml;
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
//                html += '<th class="next available"><i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            //adjust maxDate to reflect the dateLimit setting in order to
            //grey out end dates beyond the dateLimit
            if (this.endDate == null && this.dateLimit) {
                var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
                if (!maxDate || maxLimit.isBefore(maxDate)) {
                    maxDate = maxLimit;
                }
            }

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';

                for (var col = 0; col < 7; col++) {

                    var classes = [];

                    //highlight today's date
                    if (calendar[row][col].isSame(new Date(), "day"))
                        classes.push('today');

                    //highlight weekends
                    if (calendar[row][col].isoWeekday() > 5)
                        classes.push('weekend');

                    //grey out the dates in other months displayed at beginning and end of this calendar
                    if (calendar[row][col].month() != calendar[1][1].month())
                        classes.push('off');

                    //don't allow selection of dates before the minimum date
                    if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
                        classes.push('off', 'disabled');

                    //don't allow selection of dates after the maximum date
                    if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
                        classes.push('off', 'disabled');

                    //don't allow selection of date if a custom function decides it's invalid
                    if (this.isInvalidDate(calendar[row][col]))
                        classes.push('off', 'disabled');

                    //highlight the currently selected start date
                    if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD'))
                        classes.push('active', 'start-date');

                    //highlight the currently selected end date
                    if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD'))
                        classes.push('active', 'end-date');

                    //highlight dates in-between the selected dates
                    if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                        classes.push('in-range');
                        
                    var cname = '', disabled = false,dateTime = '' ;
                    var capacityTemp='';
                    for (var i = 0; i < classes.length; i++) {
                        cname += classes[i] + ' ';
                        if (classes[i] == 'disabled')
                            disabled = true;
                    }
                    if (!disabled)
                        cname += 'available';
                    for (key in this.capacity) {
					    if (this.capacity.hasOwnProperty(key)) {
					         if(calendar[row][col].format('YYYYMMDD') == key  ){
					         	capacityTemp = this.capacity[key]
					         }
					    }
					}  
                    var monthNumStart = this.startDate.month();
					var tempMonth = calendar[row][col].month();
					var monthNumEnd = this.endDate.month();
					if(side=="left"){
						 if(tempMonth==monthNumStart){
							//当前月份正常的日期
								if(capacityTemp!=""){
									//modify by duanweidong
									//可用库存
									var availNum = capacityTemp.trim().split('-')[0]-0;
									if(availNum==0){
										//可用库存为0份
										html += '<td  class="unavailcolor"  style="padding:1px">' + '<div style="width:100%" tabindex="0" data-side="'+side+'"  role="button" data-toggle="popover"    class="' + cname.replace(/^\s+|\s+$/g, '') + ' calspan unavailcolor" data-title="' + 'r' + row + 'c' + col + '"><span style="font-size:5px">'+calendar[row][col].date()+'</span></br><span style="text-align:center;display:block;font-size:16px">'+capacityTemp+'</span></div></td>';
									}else{
										html += '<td class="availcolor"  style="padding:1px">' + '<div style="width:100%" tabindex="0" data-side="'+side+'" role="button" data-toggle="popover"    class="' + cname.replace(/^\s+|\s+$/g, '') + ' calspan availcolor"  data-title="' + 'r' + row + 'c' + col + '"><span >'+calendar[row][col].date()+'</span></br><span style="text-align:center;display:block;font-size:16px">'+capacityTemp+'</span></div></td>';
									}
								}else{
									html += '<td  class="unavailcolor"  style="padding:1px">' + '<div style="width:100%" data-side="'+side+'"   class="calspan unavailcolor" data-title="' + 'r' + row + 'c' + col + '"><span style="text-align:left;display:block">'+calendar[row][col].date()+'</br>'+capacityTemp+'</div>'+' </td>';
								}
						 }else{
							 html +='<td style="padding:1px"></td>';
						 }
						
					}else if(side=="right"){
						if(tempMonth==monthNumEnd){
							//当前月份正常的日期
							if(capacityTemp!=""){
								//modify by duanweidong
								//可用库存
								var availNum = capacityTemp.trim().split('-')[0]-0;
								if(availNum==0){
									//可用库存为0份
									html += '<td class="unavailcolor"  style="padding:1px">' + '<div style="width:100%" tabindex="0" data-side="'+side+'" role="button" data-toggle="popover"    class="' + cname.replace(/^\s+|\s+$/g, '') + ' calspan unavailcolor" data-title="' + 'r' + row + 'c' + col + '"><span style="font-size:5px">'+calendar[row][col].date()+'</span></br><span style="text-align:center;display:block;font-size:16px">'+capacityTemp+'</span></div></td>';
								}else{
									html += '<td class="availcolor"   style="padding:1px">' + '<div style="width:100%" tabindex="0" data-side="'+side+'"  role="button" data-toggle="popover"    class="' + cname.replace(/^\s+|\s+$/g, '') + ' calspan availcolor" data-title="' + 'r' + row + 'c' + col + '"><span >'+calendar[row][col].date()+'</span></br><span style="text-align:center;display:block;font-size:16px">'+capacityTemp+'</span></div></td>';
								}
							}else{
								html += '<td class="unavailcolor"  style="padding:1px">' + '<div style="width:100%" data-side="'+side+'"  class="calspan unavailcolor" data-title="' + 'r' + row + 'c' + col + '"><span >'+calendar[row][col].date()+'</br>'+capacityTemp+'</div>'+' </td>';
							}
						}else{
							html +='<td style="padding:1px"></td>';
						}
					}
                    
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';
            this.container.find('.calendar.' + side + ' .calendar-table').html(html);

        },
//	 createPopover:function(event){
//            $('[data-toggle="popover"]').each(function () {
//                var element = $(this);
//                var txt = element.html();
//                var newTxt = txt.substring(txt.indexOf("<br>")+4,txt.length);
//                var ytxt = newTxt.substring(0,newTxt.indexOf("-"))
//                var ntxt = newTxt.substring(newTxt.indexOf("-")+1,newTxt.length)
//                
//                element.popover({
//                    trigger: 'manual',
//                    placement: 'bottom', //top, bottom, left or right
//                    html: 'true',
//                    title:"",
//                    content:  '<div  style="width:200px;margin:-5px -10px">'+
//							'<div class="col-md-5" style="text-align: left;width:200px;background-color:#f5f5f5;padding:5px 5px 2px 10px">'+
//								'可用：'+ytxt+
//							'</div>'+
//							'<div class="col-md-5"  style="text-align: left;width:200px;background-color: #f5f5f5;padding:5px 5px 2px 10px">'+
//							'提交未确认：'+ntxt+
//							'</div>'+
//						'</div>'
//
//                }).on("mouseenter", function () {
//                    var _this = this;
//                    $(this).popover("show");
//                    $(this).siblings(".popover").on("mouseleave", function () {
//                        $(_this).popover('hide');
//                    });
//                }).on("mouseleave", function () {
//                    var _this = this;
//                       $(_this).popover("hide")
////                    setTimeout(function () {
////                        if (!$(".popover:hover").length) {
////                         
////                        }
////                    }, 10);
//                });
//            });
//		},
		
        renderTimePicker: function(side) {

            var html, selected, minDate, maxDate = this.maxDate;

            if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate)))
                maxDate = this.startDate.clone().add(this.dateLimit);

            if (side == 'left') {
                selected = this.startDate.clone();
                minDate = this.minDate;
            } else if (side == 'right') {
                selected = this.endDate ? this.endDate.clone() : this.previousRightTime.clone();
                minDate = this.startDate;

                //Preserve the time already selected
                var timeSelector = this.container.find('.calendar.right .calendar-time div');
                if (timeSelector.html() != '') {

                    selected.hour(timeSelector.find('.hourselect option:selected').val() || selected.hour());
                    selected.minute(timeSelector.find('.minuteselect option:selected').val() || selected.minute());
                    selected.second(timeSelector.find('.secondselect option:selected').val() || selected.second());

                    if (!this.timePicker24Hour) {
                        var ampm = timeSelector.find('.ampmselect option:selected').val();
                        if (ampm === 'PM' && selected.hour() < 12)
                            selected.hour(selected.hour() + 12);
                        if (ampm === 'AM' && selected.hour() === 12)
                            selected.hour(0);
                    }

                    if (selected.isBefore(this.startDate))
                        selected = this.startDate.clone();

                    if (selected.isAfter(maxDate))
                        selected = maxDate.clone();

                }
            }

            //
            // hours
            //

            html = '<select class="hourselect">';

            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;

            for (var i = start; i <= end; i++) {
                var i_in_24 = i;
                if (!this.timePicker24Hour)
                    i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);

                var time = selected.clone().hour(i_in_24);
                var disabled = false;
                if (minDate && time.minute(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.minute(0).isAfter(maxDate))
                    disabled = true;

                if (i_in_24 == selected.hour() && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                } else {
                    html += '<option value="' + i + '">' + i + '</option>';
                }
            }

            html += '</select> ';

            //
            // minutes
            //

            html += ': <select class="minuteselect">';

            for (var i = 0; i < 60; i += this.timePickerIncrement) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().minute(i);

                var disabled = false;
                if (minDate && time.second(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.second(0).isAfter(maxDate))
                    disabled = true;

                if (selected.minute() == i && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                } else {
                    html += '<option value="' + i + '">' + padded + '</option>';
                }
            }

            html += '</select> ';

            //
            // seconds
            //

            if (this.timePickerSeconds) {
                html += ': <select class="secondselect">';

                for (var i = 0; i < 60; i++) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.clone().second(i);

                    var disabled = false;
                    if (minDate && time.isBefore(minDate))
                        disabled = true;
                    if (maxDate && time.isAfter(maxDate))
                        disabled = true;

                    if (selected.second() == i && !disabled) {
                        html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                    } else if (disabled) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + padded + '</option>';
                    }
                }

                html += '</select> ';
            }

            //
            // AM/PM
            //

            if (!this.timePicker24Hour) {
                html += '<select class="ampmselect">';

                var am_html = '';
                var pm_html = '';

                if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
                    am_html = ' disabled="disabled" class="disabled"';

                if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
                    pm_html = ' disabled="disabled" class="disabled"';

                if (selected.hour() >= 12) {
                    html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                } else {
                    html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                }

                html += '</select>';
            }

            this.container.find('.calendar.' + side + ' .calendar-time div').html(html);

        },

        updateFormInputs: function() {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=datepopover_start]').is(":focus") || this.container.find('input[name=datepopover_end]').is(":focus"))
                return;

            this.container.find('input[name=datepopover_start]').val(this.startDate.format(this.locale.format));
            if (this.endDate)
                this.container.find('input[name=datepopover_end]').val(this.endDate.format(this.locale.format));

            if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }
            
             

        },
        //wei.li modify 删除临时生成的日期时间段
        deleteT:function(e){
        	var ele = e.target.parentNode.parentNode;
        	 $('div[name="temp_dates"]')[$('div[name="temp_dates"]').length-1].removeChild(ele)
        	var index = -1;
        	for (var i = 0; i < this.temp_dates.length; i++) {  
			        if (this.temp_dates[i].dispaly == e.target.parentNode.title) {
			        	index =  i;
			            break;  
			        }
			    }  
			    
			var t = [];
			for (j=0;j<this.temp_dates.length;j++){
				if(j!=index){
					t[t.length] = this.temp_dates[j]
				}
			}
        	this.temp_dates = t
        
        },
        move: function() {
            var parentOffset = { top: 0, left: 0 },
                containerTop;
            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }

            if (this.drops == 'up')
                containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            else
                containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
            this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');

            if (this.opens == 'left') {
                this.container.css({
                    top: containerTop,
                    right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else if (this.opens == 'center') {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
                            - this.container.outerWidth() / 2,
                    right: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        show: function(e) {
        	this.temp_dates = [];
            if (this.isShowing) return;

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function(e) { this.outsideClick(e); }, this);

            // Bind global datepicker mousedown for hiding and
            $(document)
//              .on('mousedown.datepopover', this._outsideClickProxy)
              // also support mobile devices
//              .on('touchend.datepopover', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
//              .on('click.datepopover', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
//              .on('focusin.datepopover', this._outsideClickProxy)
			 
            // Reposition the picker if the window is resized while it's open
            $(window).on('resize.datepopover', $.proxy(function(e) { this.move(e); }, this));

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.previousRightTime = this.endDate.clone();
            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger('show.datepopover', this);
            var leftTempCal = this.leftCalendar;
            var rightTempCal = this.rightCalendar;
            var detailCapacity = this.detailCapacity;//duanweidong modify
//            console.log($('div[data-toggle="popover"]'));
//            console.log(this.calId);
            //给body添加事件
//      	  
            $('#'+this.calId+' div[data-toggle="popover"]').each(function(){
            	var element = $(this);
            	var newTxt = element.children(":last").text();
              var ytxt = newTxt.split("-")[0];
              var ntxt = newTxt.split("-")[1];
              var dataSide = element.attr('data-side');
              var rowCol = element.attr('data-title');
              var dataDate ;
              if(dataSide=='left'){
              	dataDate = leftTempCal.calendar[rowCol.charAt(1)-0][rowCol.charAt(3)-0];
              }else{
              	dataDate = rightTempCal.calendar[rowCol.charAt(1)-0][rowCol.charAt(3)-0];
              }
              var dateStr = dataDate.format('YYYYMMDD');
              var detailStr = "";
              var asdf = detailCapacity[dateStr];
              if(asdf){
              	detailStr = detailCapacity[dateStr];
              }
              element.on('click',function(){
//            	  var isSame = false;
//            	  if($('.calshowpop').size()>0){
//            		  isSame = $('.calshowpop').get(0)==$(this).get(0);
//            	  }
//            	  //去除popover显示
//            	  if(!isSame){
//            		  $('.calshowpop').removeClass('calshowpop').popover('hide');
//            	  }
            	  //显示详情
            	  var ele = $(this);
            	  $(this).popover('show');
            	  $(this).addClass('calshowpop');
            	  $(this).next().find('button.close').on('click',function(){
            		  ele.popover('hide');
            		  ele.next().find('button.close').unbind('click');
            	  });
            	  
            	  ele.on('blur',function(){
            		  ele.popover('hide');
            		  ele.unbind('blur');
            	  });
            	  ele.focus();
            	  
//            	  $('body').on('click',function(event){
//            		  var isSame = false;
//            		  isSame = ele.get(0)==event.target;
//            		  var eleChildren = ele.children();
//            		  for(var i=0;i<eleChildren.size()&&!isSame;i++){
//            			  isSame = eleChildren.get(i)==$(event.target);
//            		  }
////            		  console.log(event.target);
////            		  console.log(ele.get(0));
////            		  console.log(event.target != ele.get(0));
//            		  if(!isSame){
//            			  $('.calshowpop').removeClass('calshowpop').popover('hide');
//            		  }
//            		  event.stopPropagation();
//	          	  });
            	  
              });
        	 
              element.popover({
                  trigger: 'manual',
                  placement: 'bottom', //top, bottom, left or right
                  html: 'true',
                  title:"",
                  content:  '<div  style="width:200px;margin:-5px -10px">'+
  						'<div class="col-md-5" style="text-align: left;width:200px;background-color:#f5f5f5;padding:5px 5px 2px 10px">'+
  							'可用：'+ytxt+
  						'份<button  class="close"><span >&times;</span></div></button>'+
  						'<div class="col-md-5"  style="text-align: left;width:200px;background-color: #f5f5f5;padding:5px 5px 2px 10px">'+
  						'提交未确认：'+ntxt+
  						'份</div>'+
  						'<div class="col-md-5"  style="height:auto;text-align: left;width:200px;background-color: #f5f5f5;padding:5px 5px 2px 10px">'+detailStr+'</div>'+
  					'</div>'

              });
//              .on("mouseenter", function () {
//                  var _this = this;
//                  $(this).popover("show");
//                  $(this).siblings(".popover").on("mouseleave", function () {
//                      $(_this).popover('hide');
//                  });
//              }).on("mouseleave", function () {
//                  var _this = this;
//                     $(_this).popover("hide")
////                  setTimeout(function () {
////                      if (!$(".popover:hover").length) {
////                       
////                      }
////                  }, 10);
//              });
            });
//            console.log(detailCapacity);
//            $('[data-toggle="popover"]').each(function () {
//                var element = $(this);
////                var txt = element.children(":last").text();
//                var newTxt = element.children(":last").text();
//                var ytxt = newTxt.split("-")[0];
//                var ntxt = newTxt.split("-")[1];
//                var dataSide = element.attr('data-side');
//                var rowCol = element.attr('data-title');
////                console.log(rowCol);
////                console.log(rowCol.charAt(1));
////                console.log(rowCol.charAt(3));
////                console.log(dataSide);
//                var dataDate ;
////                console.log(leftTempCal);
////                console.log(rightTempCal);
//                if(dataSide=='left'){
//                	dataDate = leftTempCal.calendar[rowCol.charAt(1)-0][rowCol.charAt(3)-0];
//                }else{
//                	dataDate = rightTempCal.calendar[rowCol.charAt(1)-0][rowCol.charAt(3)-0];
//                }
//                var dateStr = dataDate.format('YYYYMMDD');
//                var detailStr = "";
//                var asdf = detailCapacity[dateStr];
//                if(asdf){
//                	detailStr = detailCapacity[dateStr];
//                }
//                element.popover({
//                    trigger: 'manual',
//                    placement: 'right', //top, bottom, left or right
//                    html: 'true',
//                    title:"",
//                    content:  '<div  style="width:200px;margin:-5px -10px">'+
//    						'<div class="col-md-5" style="text-align: left;width:200px;background-color:#f5f5f5;padding:5px 5px 2px 10px">'+
//    							'可用：'+ytxt+
//    						'</div>'+
//    						'<div class="col-md-5"  style="text-align: left;width:200px;background-color: #f5f5f5;padding:5px 5px 2px 10px">'+
//    						'提交未确认：'+ntxt+
//    						'</div>'+
//    						'<div class="col-md-5"  style="height:auto;text-align: left;width:200px;background-color: #f5f5f5;padding:5px 5px 2px 10px">'+detailStr+'</div>'+
//    					'</div>'
//
//                }).on("mouseenter", function () {
//                    var _this = this;
//                    $(this).popover("show");
//                    $(this).siblings(".popover").on("mouseleave", function () {
//                        $(_this).popover('hide');
//                    });
//                }).on("mouseleave", function () {
//                    var _this = this;
//                       $(_this).popover("hide")
////                    setTimeout(function () {
////                        if (!$(".popover:hover").length) {
////                         
////                        }
////                    }, 10);
//                });
//            });
            
            //去掉active的属性
            $('.active').removeClass('active'); // modify by duanweidong
            
            
            
            this.isShowing = true;
        },

        hide: function(e) {
            if (!this.isShowing) return;

            //incomplete date selection, revert to last values
            if (!this.endDate) {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone();
            }
			
			//wei.li modify 重置开始时间，结束时间 moment(options.startDate, this.locale.format);  this.startDate.format(this.locale.format)
		
			if(this.mulitDates){
				
				//设置初始值如果点击空白处不选择时间，则设置时间默认值
				var minStart =  null;
				var maxEnd = null;
				for(var i=0;i<this.temp_dates.length;i++){
					if(minStart == null||this.temp_dates[i].start<minStart){
						minStart = this.temp_dates[i].start;
					}
					if(maxEnd == null||this.temp_dates[i].end>maxEnd){
						maxEnd = this.temp_dates[i].end;
					}
				}
				if(minStart  == null){
					minStart = this.startDate
				}
				if(maxEnd  == null){
					maxEnd = this.endDate
				}
				this.startDate = moment(minStart, this.locale.format);
				this.endDate = moment(maxEnd, this.locale.format);
			}
            //if a new date range was selected, invoke the user callback function
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.callback( this.startDate.format(this.locale.format), this.endDate.format(this.locale.format), this.chosenLabel,this.temp_dates);//wei.li modify add this.temp_dates
			
            //if picker is attached to a text input, update it
            this.updateElement();

            $(document).off('.datepopover');
            $(window).off('.datepopover');
            this.container.hide();
            this.element.trigger('hide.datepopover', this);
            this.isShowing = false;
            this.temp_dates = [];
        },

        toggle: function(e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },

        outsideClick: function(e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix
                e.type == "focusin" ||
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-table').length
                ) return;
            this.hide();
            
        },

        showCalendars: function() {
            this.container.addClass('show-calendar');
            this.move();
            this.element.trigger('showCalendar.datepopover', this);
        },

        hideCalendars: function() {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.datepopover', this);
        },

        hoverRange: function(e) {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=datepopover_start]').is(":focus") || this.container.find('input[name=datepopover_end]').is(":focus"))
                return;

            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=datepopover_start]').val(dates[0].format(this.locale.format));
                this.container.find('input[name=datepopover_end]').val(dates[1].format(this.locale.format));
            }
            
        },

//        clickRange: function(e) {
//        	 $('div[name="temp_dates"]').hide();
//            var label = e.target.innerHTML;
//            this.chosenLabel = label;
//            if (label == this.locale.customRangeLabel) {
//                this.showCalendars();
//            } else {
//                var dates = this.ranges[label];
//                this.startDate = dates[0];
//                this.endDate = dates[1];
//
//                if (!this.timePicker) {
//                    this.startDate.startOf('day');
//                    this.endDate.endOf('day');
//                }
//
//                this.hideCalendars();
//                this.clickApply();
//                this.click_temp = true;//wei.li modify
//                this.updateView();
//            }
//          
//        },

        clickPrev: function(e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract(2, 'month');
                if (this.linkedCalendars)
                    this.rightCalendar.month.subtract(2, 'month');
            } else {
                this.rightCalendar.month.subtract(2, 'month');
            }
            this.updateCalendars();
            this.callback( this.startDate.format(this.locale.format), this.endDate.format(this.locale.format),this)
        },

        clickNext: function(e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add(2, 'month');
            } else {
                this.rightCalendar.month.add(2, 'month');
                if (this.linkedCalendars)
                    this.leftCalendar.month.add(2, 'month');
            }
        
            this.updateCalendars();
             this.callback( this.startDate.format(this.locale.format), this.endDate.format(this.locale.format),this)
        },

        hoverDate: function(e) {
			
            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=datepopover_start]').is(":focus") || this.container.find('input[name=datepopover_end]').is(":focus"))
                return;

            //ignore dates that can't be selected
            if (!$(e.target).hasClass('available')) return;

            //have the text inputs above calendars reflect the date being hovered over
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
          
            if (this.endDate) {
                this.container.find('input[name=datepopover_start]').val(date.format(this.locale.format));
            } else {
                this.container.find('input[name=datepopover_end]').val(date.format(this.locale.format));
            }
            //highlight the dates between the start date and the date being hovered as a potential end date
            var leftCalendar = this.leftCalendar;
            var rightCalendar = this.rightCalendar;
            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find('.calendar td div').each(function(index, el) {

                    //skip week numbers, only look at dates
                    if ($(el).hasClass('week')) return;
                    
                    var title = $(el).attr('data-title');
                    if(title ==undefined) return;
                    var row = title.substr(1, 1);
                    var col = title.substr(3, 1);
                    var cal = $(el).parents('.calendar');
                    var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

                    if (dt.isAfter(startDate) && dt.isBefore(date)) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range ');
                    }

                });
            }

        },

//        clickDate: function(e) {
//			 $('div[name="temp_dates"]').show();
//            if (!$(e.target).hasClass('available')) return;
//            var title = $(e.target).attr('data-title');
//            var row = title.substr(1, 1);
//            var col = title.substr(3, 1);
//            var cal = $(e.target).parents('.calendar');
//            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
//
//            //
//            // this function needs to do a few things:
//            // * alternate between selecting a start and end date for the range,
//            // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
//            // * if autoapply is enabled, and an end date was chosen, apply the selection
//            // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
//            //
//			
//			
//            if (this.endDate || date.isBefore(this.startDate, 'day')) {
//                if (this.timePicker) {
//                    var hour = parseInt(this.container.find('.left .hourselect').val(), 10);
//                    if (!this.timePicker24Hour) {
//                        var ampm = cal.find('.ampmselect').val();
//                        if (ampm === 'PM' && hour < 12)
//                            hour += 12;
//                        if (ampm === 'AM' && hour === 12)
//                            hour = 0;
//                    }
//                    var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
//                    var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
//                    date = date.clone().hour(hour).minute(minute).second(second);
//                }
//                this.endDate = null;
//                this.setStartDate(date.clone());
//            } else if (!this.endDate && date.isBefore(this.startDate)) {
//                //special case: clicking the same date for start/end, 
//                //but the time of the end date is before the start date
//                this.setEndDate(this.startDate.clone());
//            } else {
//                if (this.timePicker) {
//                    var hour = parseInt(this.container.find('.right .hourselect').val(), 10);
//                    if (!this.timePicker24Hour) {
//                        var ampm = this.container.find('.right .ampmselect').val();
//                        if (ampm === 'PM' && hour < 12)
//                            hour += 12;
//                        if (ampm === 'AM' && hour === 12)
//                            hour = 0;
//                    }
//                    var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
//                    var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
//                    date = date.clone().hour(hour).minute(minute).second(second);
//                }
//                this.setEndDate(date.clone());
//                if (this.autoApply)
//                    this.clickApply();
//            }
//
//            if (this.singleDatePicker) {
//                this.setEndDate(this.startDate);
//                if (!this.timePicker)
//                    this.clickApply();
//            }
//            this.click_temp = true;//wei.li modify
//            this.updateView();
//
//        },

//        clickApply: function(e) {
//            this.hide();
//            this.element.trigger('apply.datepopover', this);
//        },

//        clickCancel: function(e) {
//        	
//            this.startDate = this.oldStartDate;
//            this.endDate = this.oldEndDate;
//            this.hide();
//            this.element.trigger('cancel.datepopover', this);
//        },

        monthOrYearChanged: function(e) {
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.'+leftOrRight);

            // Month must be Number for new moment versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            if (!isLeft) {
                if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
                    month = this.startDate.month();
                    year = this.startDate.year();
                }
            }

            if (this.minDate) {
                if (year < this.minDate.year() || (year == this.minDate.year() && month < this.minDate.month())) {
                    month = this.minDate.month();
                    year = this.minDate.year();
                }
            }

            if (this.maxDate) {
                if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
                    month = this.maxDate.month();
                    year = this.maxDate.year();
                }
            }

            if (isLeft) {
                this.leftCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            } else {
                this.rightCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
            this.updateCalendars();
        },

        timeChanged: function(e) {

            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);
            var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

            if (!this.timePicker24Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                start.second(second);
                this.setStartDate(start);
                if (this.singleDatePicker) {
                    this.endDate = this.startDate.clone();
                } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                    this.setEndDate(start.clone());
                }
            } else if (this.endDate) {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                end.second(second);
                this.setEndDate(end);
            }

            //update the calendars so all clickable dates reflect the new time component
            this.updateCalendars();

            //update the form inputs above the calendars with the new time
            this.updateFormInputs();

            //re-render the time pickers because changing one selection can affect what's enabled in another
            this.renderTimePicker('left');
            this.renderTimePicker('right');

        },

        formInputsChanged: function(e) {
            var isRight = $(e.target).closest('.calendar').hasClass('right');
            var start = moment(this.container.find('input[name="datepopover_start"]').val(), this.locale.format);
            var end = moment(this.container.find('input[name="datepopover_end"]').val(), this.locale.format);

            if (start.isValid() && end.isValid()) {

                if (isRight && end.isBefore(start))
                    start = end.clone();

                this.setStartDate(start);
                this.setEndDate(end);

                if (isRight) {
                    this.container.find('input[name="datepopover_start"]').val(this.startDate.format(this.locale.format));
                } else {
                    this.container.find('input[name="datepopover_end"]').val(this.endDate.format(this.locale.format));
                }

            }

            this.updateCalendars();
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
            }
        },

        elementChanged: function() {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;
            if (this.element.val().length < this.locale.format.length) return;

            var dateString = this.element.val().split(this.locale.separator),
                start = null,
                end = null;

            if (dateString.length === 2) {
                start = moment(dateString[0], this.locale.format);
                end = moment(dateString[1], this.locale.format);
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.locale.format);
                end = start;
            }

            if (!start.isValid() || !end.isValid()) return;

            this.setStartDate(start);
            this.setEndDate(end);
            this.updateView();
        },

        keydown: function(e) {
            //hide on tab or enter
            if ((e.keyCode === 9) || (e.keyCode === 13)) {
                this.hide();
            }
        },

        updateElement: function() {
        
            if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                this.element.trigger('change');
            } else if (this.element.is('input') && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format));
                this.element.trigger('change');
            }
        },

        remove: function() {
            this.container.remove();
            this.element.off('.datepopover');
            this.element.removeData();
        }

    };

    $.fn.datepopover = function(options, callback) {
        this.each(function() {
            var el = $(this);
            if (el.data('datepopover')){
            	el.data('datepopover').remove();
            }
    		
    		el.data('datepopover', new datepopover(el, options, callback));
    		el.data('datepopover').show(); 
        });
        return this;
    };
    
    return datepopover;

}));
