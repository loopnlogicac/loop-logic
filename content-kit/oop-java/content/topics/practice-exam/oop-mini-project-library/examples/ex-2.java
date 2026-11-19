import java.util.Scanner;
import java.util.Map;
import java.util.TreeMap;
import java.util.List;
import java.util.ArrayList;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.nio.charset.StandardCharsets;
import java.io.IOException;

interface Loanable {
    boolean borrow();
    boolean giveBack();
}
abstract class LibraryItem {
    private final int id;
    private final String title;
    LibraryItem(int id, String title) {
        if (id < 1 || id > 999999 || title.isBlank() || title.length() > 80
                || title.indexOf('\t') >= 0 || title.indexOf('\n') >= 0
                || title.indexOf('\r') >= 0) {
            throw new IllegalArgumentException("Invalid item");
        }
        this.id = id;
        this.title = title;
    }
    int id() { return id; }
    String title() { return title; }
    abstract String status();
}
class Book extends LibraryItem implements Loanable {
    private boolean borrowed;
    Book(int id, String title, boolean borrowed) {
        super(id, title);
        this.borrowed = borrowed;
    }
    @Override
    public boolean borrow() {
        if (borrowed) { return false; }
        borrowed = true;
        return true;
    }
    @Override
    public boolean giveBack() {
        if (!borrowed) { return false; }
        borrowed = false;
        return true;
    }
    @Override
    String status() { return borrowed ? "BORROWED" : "AVAILABLE"; }
}
class Library {
    private Map<Integer, Book> books = new TreeMap<>();
    boolean add(Book book) { return books.putIfAbsent(book.id(), book) == null; }
    Book find(int id) { return books.get(id); }
    List<Book> snapshot() { return new ArrayList<>(books.values()); }
    void replace(List<Book> loaded) {
        Map<Integer, Book> candidate = new TreeMap<>();
        for (Book book : loaded) {
            if (candidate.putIfAbsent(book.id(), book) != null) {
                throw new IllegalArgumentException("Duplicate id");
            }
        }
        books = candidate;
    }
}
class TextStore {
    private final Path file;
    TextStore(Path file) { this.file = file; }
    void save(List<Book> books) throws IOException {
        List<String> lines = new ArrayList<>();
        for (Book book : books) {
            lines.add(book.id() + "\t" + book.title() + "\t" + book.status());
        }
        Path absolute = file.toAbsolutePath();
        Path temporary = Files.createTempFile(absolute.getParent(), "library-", ".tmp");
        try {
            Files.write(temporary, lines, StandardCharsets.UTF_8);
            Files.move(temporary, absolute, StandardCopyOption.REPLACE_EXISTING);
        } finally {
            Files.deleteIfExists(temporary);
        }
    }
    List<Book> load() throws IOException {
        List<Book> result = new ArrayList<>();
        Map<Integer, Boolean> seen = new TreeMap<>();
        for (String line : Files.readAllLines(file, StandardCharsets.UTF_8)) {
            String[] fields = line.split("\t", -1);
            if (fields.length != 3) { throw new IOException("Invalid row"); }
            try {
                int id = Integer.parseInt(fields[0]);
                if (!fields[2].equals("AVAILABLE") && !fields[2].equals("BORROWED")) {
                    throw new IllegalArgumentException("Invalid status");
                }
                Book book = new Book(id, fields[1], fields[2].equals("BORROWED"));
                if (seen.putIfAbsent(id, Boolean.TRUE) != null) {
                    throw new IllegalArgumentException("Duplicate id");
                }
                result.add(book);
            } catch (IllegalArgumentException problem) {
                throw new IOException("Invalid book", problem);
            }
        }
        return result;
    }
}
class Main {
    public static void main(String[] args) throws IOException {
        Path directory = Files.createTempDirectory("library-rollback-");
        Path file = directory.resolve("library.tsv");
        try {
            Library library = new Library();
            library.add(new Book(3, "Existing", false));
            TextStore store = new TextStore(file);
            Files.writeString(file, "9\tNew\tAVAILABLE\n9\tDuplicate\tBORROWED\n",
                    StandardCharsets.UTF_8);
            try {
                library.replace(store.load());
            } catch (IOException problem) {
                System.out.println("LOAD FAILED");
            }
            for (LibraryItem item : library.snapshot()) {
                System.out.println(item.id() + " | " + item.title() + " | " + item.status());
            }
        } finally {
            Files.deleteIfExists(file);
            Files.deleteIfExists(directory);
        }
    }
}
