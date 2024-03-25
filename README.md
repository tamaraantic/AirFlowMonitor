# AirFlowMonitor
# System Description

The system serves to visualize sensor data readings and promptly alert employees to any detected values if necessary, ensuring swift response to potential issues. Below are the key functionalities provided by the system:

### User Authentication
Users previously registered in the system by the administrator can sign in using their email address and password.

### Parameter Monitoring- Building-Level
The system enables the systematic graphical representation of all parameters (carbon monoxide levels, temperature, and air humidity) at the building level. Real-time values of parameters are displayed on the graph.

### Parameter Monitoring- Office-Level
The Graphical representation of parameters (carbon monoxide levels, temperature, and air humidity) for each office within the building is provided. The graphs display real-time parameter values.

### Alert System
The system implements an alert system that constantly checks sensor measurements against expected values. It compares measured values with expected ranges and notifies responsible personnel if values deviate from the expected range. Notifications to employees are sent via the user interface and email.

## Warning Broadcasting to All Employees
In addition to automatic notifications sent by the system based on predefined rules, the system allows maintenance staff overseeing all building parameters to send evacuation orders to all employees with a click of a button if they notice unusual readings. In such cases, an email is sent to all employees instructing them to evacuate the building immediately.

## Data Management (CRUD Operations)
The system allows users to view, delete, modify, and create new data related to offices, sensors, sensor types, sensor installations, and employees.

# Demo video
Please find the demo video available for viewing here: https://youtu.be/i4KWgH80MIE.

