import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import "./InfoBox.css"
function Infobox({title ,cases,total}) {
    return (
      <div>
        <Card className="infoBox">
          <CardContent>
            <Typography className="infoBox__title" color="textSecondary">
              {title}
            </Typography>
            <h2 className="infoBox__cases">{cases} cases</h2>
            <Typography className="infoBox__total" color="textSecondary">
              {total} cases
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
}

export default Infobox
