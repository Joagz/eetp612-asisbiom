package eetp612.com.ar.asisbiom.document;

import java.util.ArrayList;

import org.apache.poi.ss.usermodel.CellType;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
class Cell {
    private String value;
    private CellType cellType;
}

@Data
@ToString
class Column {
    private int index;
    private ArrayList<Cell> cells;
}

@Data
@ToString
class Row {
    private int index;
    private ArrayList<Cell> cells;
}

@Data
@ToString
public class Document {

    private ArrayList<String> headers;
    private ArrayList<Row> rows;

    public Document(String... values) {
        ArrayList<String> headers = new ArrayList<>();

        for (String v : values) {
            headers.add(v);
        }

        this.headers = headers;
    }

    // Rellena una columna reescribiendo todas las filas
    void fillColumn(Column column) {

        if (column.getCells().size() > this.rows.size()) {
            for (int i = 0; i < column.getCells().size() - this.rows.size(); i++) {
                this.rows.add(new Row());
            }
        }

        int i = 0;
        ArrayList<Row> newRows = new ArrayList<>();
        for (Cell cell : column.getCells()) {
            Row r = this.rows.get(i);
            ArrayList<Cell> rCells = r.getCells();
            rCells.set(column.getIndex(), cell);
            r.setCells(rCells);

            newRows.add(r);
        }

        this.rows = newRows;

    }

    // Insertar valores desde la columna con indice "column" (inclusive)
    // en la posicion index
    void insertRowFrom(int column, int index, ArrayList<Cell> toAdd) {
        Row r = this.getRows().get(index);

        ArrayList<Cell> newCells = new ArrayList<>();
        newCells.addAll(r.getCells().subList(0, column));

        for (int i = column; i < this.headers.size(); i++) {
            newCells.add(toAdd.get(i));
        }
        r.setCells(newCells);
        this.rows.set(index, r);
    }

    // Insertar valores desde la columna con indice columnFrom hasta columnTo
    // (inclusive)
    // desde la posicion index
    void insertRowFrom(int columnFrom, int columnTo, int index, ArrayList<Cell> toAdd) {
        Row r = this.getRows().get(index);

        ArrayList<Cell> newCells = new ArrayList<>();
        newCells.addAll(r.getCells().subList(0, columnFrom));

        for (int i = columnFrom; i <= columnTo; i++) {
            newCells.add(toAdd.get(i));
        }

        newCells.addAll(r.getCells().subList(columnTo, r.getCells().size()));

        r.setCells(newCells);
        this.rows.set(index, r);
    }

    // retorna el indice de la fila
    int appendRow(Row row) {
        this.rows.add(row);
        return this.rows.size() - 1;
    }

    // O(n) (en realidad es O(n - index))
    void insertRow(int index, Row row) {
        Row temp = row;

        for (int i = index; i < this.rows.size() + 1; i++) {
            Row prev = this.rows.set(index, temp);
            temp = prev;
        }
    }

}
