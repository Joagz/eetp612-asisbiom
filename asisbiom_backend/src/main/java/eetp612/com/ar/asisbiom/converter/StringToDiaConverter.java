package eetp612.com.ar.asisbiom.converter;


import org.springframework.core.convert.converter.Converter;

import eetp612.com.ar.asisbiom.general.Dia;

public class StringToDiaConverter implements Converter<String, Dia> {

    @Override
    public Dia convert(@SuppressWarnings("null") String source) {
        return Dia.valueOf(source.toUpperCase());
    }
    
}
