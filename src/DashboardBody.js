
import { LineChart } from '@mui/x-charts';
import SlippingAway from './SlippingAway'

const DB_Body = () => {
    const xLabels = ["Sunday",'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const xAxis = [{ scaleType: 'point', data: xLabels }];


    

    return ( 
        <div>
            <div className="DB_Under_Bar">
                <h1>Dashboard</h1>
            </div>
            <div className="DB_Graphs_Background">
                <div className="DB_Graph">
                    <div className='card_top'>RECENT ATTENDANCE</div>
                    <LineChart xAxis={xAxis}
                        series={[
                            {curve: "linear", data: [1, 8, 3, 6, 1, 10, 4], color: 'red',},
                            {curve: "linear", data: [2, 4, 5, 8, 3, 6, 10], color: 'blue',},
                        ]}
                        width={600}
                        height={300}
                        grid={{ vertical: true, horizontal: true }}/>
                </div>
                <SlippingAway />
            </div>

            
            
        
        
        
        </div>
        
        
     );
}
 
export default DB_Body;