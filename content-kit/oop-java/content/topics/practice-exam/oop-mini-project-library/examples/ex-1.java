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
        try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
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
        boolean temporary = args.length == 0;
        Path path = temporary ? Files.createTempFile("library-demo-", ".txt") : Path.of(args[0]);
        Library library = new Library();
        try (Scanner input = new Scanner(System.in)) {
            System.out.println("1 Add | 2 Borrow | 3 Return | 4 List | 5 Save | 6 Load | 0 Exit");
            while (input.hasNextLine()) {
                String line = input.nextLine().trim();
                if (line.equals("0")) { System.out.println("BYE"); break; }
                String[] parts = line.split("\\s+", 3);
                try {
                    switch (parts[0]) {
                        case "1" -> {
                            if (parts.length != 3) { throw new IllegalArgumentException(); }
                            Book book = new Book(Integer.parseInt(parts[1]), parts[2]);
                            System.out.println(library.add(book) ? "ADDED" : "DUPLICATE");
                        }
                        case "2", "3" -> {
                            if (parts.length != 2) { throw new IllegalArgumentException(); }
                            int id = Integer.parseInt(parts[1]);
                            System.out.println(parts[0].equals("2") ? library.borrow(id)
                                : library.returnItem(id));
                        }
                        case "4" -> {
                            if (parts.length != 1) { throw new IllegalArgumentException(); }
                            library.printBooks();
                        }
                        case "5" -> { library.save(path); System.out.println("SAVED"); }
                        case "6" -> { library.load(path); System.out.println("LOADED"); }
                        default -> System.out.println("BAD_COMMAND");
                    }
                } catch (IllegalArgumentException failure) {
                    System.out.println("BAD_INPUT");
                } catch (IOException failure) {
                    System.out.println("FILE_ERROR");
                }
            }
        } finally {
            if (temporary) { Files.deleteIfExists(path); }
        }
    }
}
