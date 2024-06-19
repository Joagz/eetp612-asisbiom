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

    public Cell(String value, CellType cellType) {
        this.value = value;
        this.cellType = cellType;
    }

}

@Data
@ToString
class Column {
    private int index;
    private ArrayList<Cell> cells;

    public Column() {
    }

    public Column(int index, String... args) {

        ArrayList<Cell> cells = new ArrayList<>();

        for (String arg : args) {
            cells.add(new Cell(arg, CellType.STRING));
        }

        this.cells = cells;
        this.index = index;
    }

}

@Data
@ToString
class Row {
    private int index;
    private ArrayList<Cell> cells;

    public Row() {

    }

    public Row(int index, String... args) {
        ArrayList<Cell> cells = new ArrayList<>();

        for (String arg : args) {
            cells.add(new Cell(arg, CellType.STRING));
        }

        this.cells = cells;
        this.index = index;
    }

}

@Data
@ToString
public class Document {

    private ArrayList<String> headers;
    private ArrayList<Row> rows;

    // Prueba unitaria
    public static void main(String[] args) {

        Document doc = new Document("NOMBRE", "APELLIDO", "CURSO", "DIVISION");

        doc.appendRow(new Row(0, "Joaquin", "Gomez", "2", "C"));
        doc.insertRow(0, new Row(1, "Maximo", "Tironi", "0", "B"));

        System.out.println();
        System.out.println(doc);

        ArrayList<Cell> toAdd = new ArrayList<>();

        toAdd.add(new Cell("4", CellType.STRING));
        toAdd.add(new Cell("A", CellType.STRING));

        doc.insertRowFrom(2, 0, toAdd);
        doc.insertRowFrom(2, 1, toAdd);

        System.out.println();
        System.out.println(doc);

    }

    public Document(String... values) {
        ArrayList<String> h = new ArrayList<>();

        for (String v : values) {
            h.add(v);
        }

        this.rows = new ArrayList<>();
        this.headers = h;
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

        for (int i = 0; i < toAdd.size(); i++) {
            newCells.add(toAdd.get(i));
        }

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

        if (index >= this.rows.size() || index < 0)
            return;

        Row temp = row;
        temp.setIndex(index);

        int i = index;
        while (true) {

            if (i == this.rows.size()) {
                this.rows.add(temp);
                break;
            }

            Row next = this.rows.set(i, temp);
            next.setIndex(i + 1);
            temp = next;
            i++;
        }

    }

}
