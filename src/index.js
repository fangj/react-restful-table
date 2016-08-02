var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
// var Promise=require('bluebird');
var agent = require('superagent-promise')(require('superagent'),Promise);

class RestfulTable extends React.Component {

   static propTypes = {
    url:React.PropTypes.string.isRequired,
    keyField:React.PropTypes.string.isRequired
   }

    constructor(props) {
        super(props);
        this.state = {
          data:[]
        };
    }

    render() {
        const me=this;
        var optionsProp = {
          afterTableComplete: me.onAfterTableComplete.bind(me), // A hook for after table render complete.
          afterDeleteRow: me.onAfterDeleteRow.bind(me),  // A hook for after droping rows.
          afterInsertRow: me.onAfterInsertRow.bind(me)   // A hook for after insert rows
        };
        var cellEditProp = {
          mode: "click",
          blurToSave: true,
          afterSaveCell: me.onAfterSaveCell.bind(me)
        };

        const {data,keyField,cellEdit,options,...others}=this.props;
        cellEditProp=Object.assign({},cellEdit,cellEditProp);
        optionsProp=Object.assign({},options,optionsProp);
        return (
          <BootstrapTable 
                data={this.state.data} keyField={keyField} remote={true} cellEdit={cellEditProp} options={optionsProp} {...others}>
           {this.props.children}
          </BootstrapTable>
 
        );
    }

    onAfterTableComplete(){

    }
    onAfterDeleteRow(rowKeys){
      const me=this;
      console.log('delete',rowKeys)
      const key=rowKeys[0]; //目前只删除第一行
      const {url}=this.props;
      agent.del(url+'/'+key).then(resp=>{
        console.log(resp.body);
        var {data}=me.state;
        data = data.filter((product) => {
          return product._id !== key;
        });

        this.setState({
          data: data
        });
      })

    }
    onAfterInsertRow(row){
      const {url,keyField}=this.props;
      delete row[keyField];
      // console.log('insert',row);
      agent.post(url,row).then(resp=>{
        console.log(resp.body)
        var {data}=this.state;
        data.push(resp.body);
        this.setState({data});
      })
    }

    onAfterSaveCell(row, cellName, cellValue){
      const {url,keyField}=this.props;
        // console.log('save',row, cellName, cellValue);
      agent.put(url+'/'+row[keyField],row).then(resp=>{
        // console.log(resp.body)
      })
    }

    componentWillMount() {
    }

    componentDidMount() {
      const {url}=this.props;
      agent.get(url).then(resp=>{
        const data=resp.body;
        this.setState({data});
      })
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }
}

module.exports = RestfulTable;
