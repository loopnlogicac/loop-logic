import java.io.IOException;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;
import java.util.Scanner;

abstract class LibraryItem {
    private final int id;
    private final String title;
    LibraryItem(int id, String title) {
        if (id <= 0 || title.isBlank() || title.contains("|")
                || title.contains("\n") || title.contains("\r")) {
            throw new IllegalArgumentException("Invalid book");
        }
        this.id = id;
        this.title = title;
    }
    int id() { return id; }
    String title() { return title; }
    abstract String kind();
}
interface Loanable {
    boolean borrow();
    boolean returnItem();
}
final class Book extends LibraryItem implements Loanable {
    private boolean borrowed;
    Book(int id, String title) { super(id, title); }
    @Override
    String kind() { return "BOOK"; }
    boolean isBorrowed() { return borrowed; }
    @Override
    public boolean borrow() {
        if (borrowed) { return false; }
        borrowed = true;
        return true;
    }
    @Override
    public boolean returnItem() {
        if (!borrowed) { return false; }
        borrowed = false;
        return true;
    }
}
final class Library {
    private Map<Integer, Book> books = new TreeMap<>();
    boolean add(Book book) { return books.putIfAbsent(book.id(), book) == null; }
    String borrow(int id) {
        Book book = books.get(id);
        if (book == null) { return "MISSING"; }
        return book.borrow() ? "BORROWED" : "UNAVAILABLE";
    }
    String returnItem(int id) {
        Book book = books.get(id);
        if (book == null) { return "MISSING"; }
        return book.returnItem() ? "RETURNED" : "NOT_BORROWED";
    }
    void printBooks() {
        if (books.isEmpty()) { System.out.println("EMPTY"); }
        for (Book book : books.values()) {
            LibraryItem item = book;
            System.out.println(item.kind() + " " + item.id() + " " + item.title()
                + " " + (book.isBorrowed() ? "OUT" : "IN"));
        }
    }
    void save(Path path) throws IOException {
        Path target = path.toAbsolutePath();
        Path stage = Files.createTempFile(target.getParent(), "library-stage-", ".txt");
        try {
            try (BufferedWriter writer = Files.newBufferedWriter(stage, StandardCharsets.UTF_8)) {
                for (Book book : books.values()) {
                    writer.write(book.id() + "|" + book.title() + "|" + book.isBorrowed());
                    writer.newLine();
                }
            }
            Files.move(stage, target, StandardCopyOption.REPLACE_EXISTING);
        } finally { Files.deleteIfExists(stage); }
    }
    void load(Path path) throws IOException {
        Map<Integer, Book> loaded = new TreeMap<>();
        try (BufferedReader reader =
                    Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\|", -1);
                if (parts.length != 3
                        || !(parts[2].equals("true") || parts[2].equals("false"))) {
                    throw new IOException("Invalid record");
                }
                try {
                    Book book = new Book(Integer.parseInt(parts[0]), parts[1]);
                    if (parts[2].equals("true")) { book.borrow(); }
                    if (loaded.putIfAbsent(book.id(), book) != null) {
                        throw new IOException("Duplicate id");
                    }
                } catch (IllegalArgumentException failure) {
                    throw new IOException("Invalid book", failure);
                }
            }
        }
        books = loaded;
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Library library = new Library();
        try (Scanner input = new Scanner(System.in)) {
            int n = Integer.parseInt(input.nextLine());
            for (int i = 0; i < n; i++) {
                String[] parts = input.nextLine().split("\\s+", 3);
                switch (parts[0]) {
                    case "ADD" -> System.out.println(library.add(
                        new Book(Integer.parseInt(parts[1]), parts[2])) ? "ADDED" : "DUPLICATE");
                    case "BORROW" ->
                        System.out.println(library.borrow(Integer.parseInt(parts[1])));
                    case "RETURN" ->
                        System.out.println(library.returnItem(Integer.parseInt(parts[1])));
                    case "LIST" -> library.printBooks();
                    default -> throw new IllegalArgumentException("Unknown command");
                }
            }
        }
    }
}
