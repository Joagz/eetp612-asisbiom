package eetp612.com.ar.asisbiom.user;

public record UserDto(
        String pwd,
        Integer id_docente,
        Integer id_role,
        String email,
        String phone) {

}
