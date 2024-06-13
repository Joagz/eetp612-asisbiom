package eetp612.com.ar.asisbiom.config;


import org.springframework.core.convert.converter.Converter;

import eetp612.com.ar.asisbiom.general.Hora;

public class StringToHoraConverter implements Converter<String, Hora> {

    @Override
    public Hora convert(@SuppressWarnings("null") String source) {
        return Hora.valueOf(source.toUpperCase());
    }
    
}
