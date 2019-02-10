import { PureComponent } from "react";

class AgreementPage extends PureComponent{
    render(){
        return (
            <div style={{overflow:"auto",height:"500px"}}>
            <h4>一、会员义务</h4>
            <ul>
                <li>1、不得违反国家规定的相关法律法规</li>
                <li>2、不侵犯他人的知识产权，如有侵犯，产生的一切经济、法律等责任由会员自行承担</li>
                <li>3、会员在平台下单时，有义务提供完整的收货人信息，包括但不限于收货人真实姓名、收货人详细地址、收货人联系手机或邮箱</li>
            </ul>    
            <h4>二、平台权利和义务</h4>
            <ul>
                <li>1、有义务保管好会员的账号信息，不得向平台之外的第三方泄露</li>
                <li>2、有权利对违反用户协议规定的会员的账号进行封号、财务冻结</li>
                <li>3、有义务保管好会员的商品信息，定期与会员做好财务结算</li>
                <li>4、当平台在运营过程中出现问题时，平台方有权力暂时或永久关闭平台，但有义务在关闭之前通知平台所有会员，由此可能给会员造成的损失，平台不负责</li>
            </ul>

            </div>
        )
    }
}
export default AgreementPage;