import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);

var myEventsList = [{
    'title': 'Conference',
    'start': moment(new Date(2018, 3, 10, 10, 30, 0, 0)).format("MMMM Do YYYY"),
    'end': new Date(2018, 3, 10),
    desc: 'Big conference for important people'
},
{
    'title': 'Meeting',
    'start': new Date(2018, 3, 12, 10, 30, 0, 0),
    'end': new Date(2018, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting'
},
{
    'title': 'Lunch',
    'start': new Date(2018, 3, 13, 10, 30, 0, 0),
    'end': new Date(2017, 3, 14, 10, 0, 0, 0),
    desc: 'Power lunch'
}]

class Calendar extends Component {
    constructor() {
        super()
        this.state = {
            events: [{
                title: "Current Day",
                start: new Date(),
                end: new Date(),
                desc: "It always have an appointment on the current day"
            }],
            'title': "",
            'start': "",
            'end': "",
            description: "",
            openSlot: false,
            openEvent: false,
            selectedEventTitle: "",
            selectedEventDescription: ""
        }
        this.handleClose = this.handleClose.bind(this);
    }

    //closes modals
    handleClose() {
        console.log("FIRED CLOSE")
        this.setState({ openEvent: false, openSlot: false });
        console.log(this.state.events)
    }

    //Allows user to click on calendar slot
    handleSlotSelected(slotInfo) {
        console.log(slotInfo)
        var startDate = moment(slotInfo.start.toLocaleString('en-US')).format("MMMM Do YYYY");
        var endDate = moment(slotInfo.end.toLocaleString('en-US')).format("MMMM Do YYYY");
        this.setState({
            openSlot: true,
            'start': startDate,
            'end': endDate
        });
        console.log('startTime', this.state.start);
        console.log('endTime', this.state.end);
    }

    handleEventSelected(event) {
        console.log(event) //Shows the event details provided while booking
        this.setState({
            openEvent: true,
            selectedEventTitle: event.title,
            selectedEventDescription: event.desc
        })

    }

    setTitle(e) {
        this.setState({ title: e })
        console.log(this.state.title)
    }

    setDescription(e) {
        this.setState({ description: e })
    }

    setAppointment() {
        console.log("Fired")
        const { start, end, title, description } = this.state;
        let appointment = {
            'title': title,
            'start': new Date(start),
            'end': new Date(end),
            description
        }
        this.setState({ events: this.state.events.push(appointment) })
    }

    updateEvent() {
        this.setState({

        })
    }

    render() {
        const eventActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Confirm Edit"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
            />
        ];
        const appointmentActions = [
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={() => { this.setAppointment(), this.handleClose() }}
            />,
        ];
        return (
            <div id="Calendar">
                <BigCalendar
                    events={this.state.events}
                    views={["month", "week", "day"]}
                    timeslots={1}
                    defaultView='month'
                    defaultDate={new Date()}
                    selectable={true}
                    onSelectEvent={event => this.handleEventSelected(event)}
                    onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
                />

                {/* Modal for booking new appointment */}
                <Dialog
                    title={`Book an appointment on ${this.state.start}`} 
                    actions={appointmentActions}
                    modal={false}
                    open={this.state.openSlot}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        hintText="Title"
                        onChange={e => { this.setTitle(e.target.value) }}
                    />
                    <br />
                    <TextField
                        hintText="Description"
                        onChange={e => { this.setDescription(e.target.value) }}
                    />
                </Dialog>

                {/* Modal for Existing Event */}
                <Dialog
                    title="View/Edit Appointment"
                    actions={eventActions}
                    modal={false}
                    open={this.state.openEvent}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        defaultValue={this.state.selectedEventTitle}
                        onChange={e => { this.setTitle(e.target.value) }}
                    /><br />
                    <TextField
                        multiLine={true}
                        defaultValue={this.state.selectedEventDescription}
                        onChange={e => { this.setDescription(e.target.value) }}
                    />
                </Dialog>
            </div>
        )
    }
}

export default Calendar;