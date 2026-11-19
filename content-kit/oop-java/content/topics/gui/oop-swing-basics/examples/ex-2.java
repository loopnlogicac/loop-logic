import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.BorderLayout;
import java.awt.GridLayout;



class Main {
    static void show() {
        JFrame frame = new JFrame("Library search");
        JPanel root = new JPanel(new BorderLayout(8, 8));
        JPanel form = new JPanel(new GridLayout(2, 2, 4, 4));
        form.add(new JLabel("Title:"));
        form.add(new JTextField(16));
        form.add(new JLabel("Author:"));
        form.add(new JTextField(16));
        root.add(new JLabel("Find a book"), BorderLayout.NORTH);
        root.add(form, BorderLayout.CENTER);
        root.add(new JButton("Search"), BorderLayout.SOUTH);
        frame.setContentPane(root);

        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.pack();
        frame.setLocationByPlatform(true);
        frame.setVisible(true);
    }
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(Main::show);
    }
}
