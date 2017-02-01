1) include the src file in your project
      <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
      <link rel='stylesheet' href='/stylesheets/datepicker.css' />
  
    <script src="javascripts/datepicker.js"></script>

      <script src="javascripts/dateRange.js"></script>


    Here, include datepicker as well, since dateRange requires datepicker


2) include the following whereever you need to show date range

    
    <daterange-Calculator daysdiff="days" from="from" to="to">

        <p>Number of days: {{days}}<br />

        From: {{from}}<br />

        To: {{to}}<br />


3) Attributes:

    daysdiff:  number of days in the range

    from:  start date(dd/mm/yyyy)

    to: end date(dd/mm/yyyy)
