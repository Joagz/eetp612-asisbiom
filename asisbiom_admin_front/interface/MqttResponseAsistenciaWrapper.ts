import Asistencia from "./Asistencia";
import MqttResponse from "./MqttResponse";

export default interface MqttResponseAsistenciaWrapper {
    response: MqttResponse,
    asistencia: Asistencia
}