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
    private static int readId(Scanner input) {
        int id = Integer.parseInt(input.nextLine().strip());
        if (id < 1 || id > 999999) { throw new IllegalArgumentException("Invalid id"); }
        return id;
    }
    private static void list(Library library) {
        List<Book> books = library.snapshot();
        if (books.isEmpty()) { System.out.println("EMPTY"); }
        for (Book book : books) {
            System.out.println(book.id() + " | " + book.title() + " | " + book.status());
        }
    }
    private static void act(String command, Scanner input, Library library, TextStore store)
            throws IOException {
        switch (command) {
            case "1" -> {
                System.out.println("Id:");
                int id = readId(input);
                System.out.println("Title:");
                String title = input.nextLine().strip();
                boolean added = library.add(new Book(id, title, false));
                System.out.println(added ? "ADDED" : "DUPLICATE");
            }
            case "2", "3" -> {
                System.out.println("Id:");
                Book book = library.find(readId(input));
                if (book == null) { System.out.println("NOT FOUND"); }
                else if (command.equals("2")) {
                    System.out.println(book.borrow() ? "BORROWED" : "UNAVAILABLE");
                } else {
                    System.out.println(book.giveBack() ? "RETURNED" : "NOT BORROWED");
                }
            }
            case "4" -> list(library);
            case "5" -> { store.save(library.snapshot()); System.out.println("SAVED"); }
            case "6" -> { library.replace(store.load()); System.out.println("LOADED"); }
            default -> System.out.println("UNKNOWN COMMAND");
        }
    }
    public static void main(String[] args) {
        Path file = args.length == 0 ? Path.of("library.tsv") : Path.of(args[0]);
        Library library = new Library();
        TextStore store = new TextStore(file);
        Scanner input = new Scanner(System.in);
        System.out.println("1 Add | 2 Borrow | 3 Return | 4 List | 5 Save | 6 Load | 0 Exit");
        while (input.hasNextLine()) {
            String command = input.nextLine().strip();
            if (command.equals("0")) { System.out.println("BYE"); return; }
            try {
                act(command, input, library, store);
            } catch (IOException problem) {
                System.out.println(command.equals("5") ? "SAVE FAILED" : "LOAD FAILED");
            } catch (IllegalArgumentException problem) {
                System.out.println("INVALID INPUT");
            } catch (java.util.NoSuchElementException problem) {
                System.out.println("INCOMPLETE COMMAND");
                return;
            }
        }
    }
}
